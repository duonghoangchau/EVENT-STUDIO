'use server';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { clearAdminSession, createAdminSession, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { normalizeFormSchema } from '@/lib/form-schema';
import { defaultFormSchema, defaultSections, defaultTheme } from '@/lib/defaults';
import { normalizePageJson } from '@/lib/page-schema';
import { verifyPassword } from '@/lib/password';
import { resolveLocalizedText } from '@/lib/preferences';
import { FormField, FormSchema } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(input: string) {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function ensureUniqueSlug(baseSlug: string, model: 'project' | 'eventForm') {
  const safeBase = slugify(baseSlug) || `item-${Date.now()}`;
  let candidate = safeBase;
  let index = 1;

  while (true) {
    const exists =
      model === 'project'
        ? await prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } })
        : await prisma.eventForm.findUnique({ where: { slug: candidate }, select: { id: true } });

    if (!exists) return candidate;

    index += 1;
    candidate = `${safeBase}-${index}`;
  }
}

function cleanJsonInput(input: string) {
  return input
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

async function saveUploadedFile(projectId: number, formId: number, field: FormField, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name || '').toLowerCase();
  const baseName = slugify(path.basename(file.name || field.name, extension)) || field.name || 'upload';
  const storedName = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;
  const relativePath = `/uploads/${storedName}`;
  const outputDir = path.join(process.cwd(), 'public', 'uploads');
  const outputPath = path.join(outputDir, storedName);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, buffer);

  const asset = await prisma.asset.create({
    data: {
      type: 'form-upload',
      filename: file.name || storedName,
      path: relativePath,
      metadata: {
        projectId,
        formId,
        fieldName: field.name,
        fieldLabel: field.label,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      },
    },
  });

  return {
    assetId: asset.id,
    filename: file.name || storedName,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    url: relativePath,
  };
}

export async function createProject(formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get('name') || 'Untitled Event');
  const slug = await ensureUniqueSlug(String(formData.get('slug') || name), 'project');
  const description = String(formData.get('description') || '');
  const location = String(formData.get('location') || '');
  const project = await prisma.project.create({
    data: { name, slug, description, location, themeJson: defaultTheme, pageJson: { sections: defaultSections }, ownerId: admin.id },
  });
  const formSlug = await ensureUniqueSlug(`${slug}-registration`, 'eventForm');
  await prisma.eventForm.create({ data: { projectId: project.id, name: 'Main Registration', slug: formSlug, schemaJson: defaultFormSchema } });
  redirect(`/admin/projects/${project.id}/builder`);
}

export async function createProjectFromTemplate(templateId: number) {
  const admin = await requireAdmin();
  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) return;

  const stamp = new Date().toISOString().slice(0, 10);
  const name = `${template.name} ${stamp}`;
  const slug = await ensureUniqueSlug(name, 'project');
  const pageJson = normalizePageJson(template.templateJson);

  const project = await prisma.project.create({
    data: {
      name,
      slug,
      description: `Created from template: ${template.name}`,
      themeJson: template.themeJson as Prisma.InputJsonValue,
      pageJson,
      ownerId: admin.id,
    },
  });

  const formSlug = await ensureUniqueSlug(`${slug}-registration`, 'eventForm');
  await prisma.eventForm.create({
    data: {
      projectId: project.id,
      name: 'Main Registration',
      slug: formSlug,
      schemaJson: defaultFormSchema,
    },
  });

  redirect(`/admin/projects/${project.id}/builder`);
}

export async function updateProjectMeta(projectId: number, formData: FormData) {
  await requireAdmin();
  const project = await prisma.project.update({ where: { id: projectId }, data: {
    name: String(formData.get('name') || ''),
    description: String(formData.get('description') || ''),
    location: String(formData.get('location') || ''),
    language: String(formData.get('language') || 'vi'),
  }});
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/${project.slug}`);
}

export async function applyAiDraft(projectId: number, formData: FormData) {
  await requireAdmin();
  const prompt = String(formData.get('prompt') || '');
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;
  const lower = prompt.toLowerCase();
  const isMedical = lower.includes('y khoa') || lower.includes('medical') || lower.includes('hội nghị');
  const isGala = lower.includes('gala') || lower.includes('tiệc') || lower.includes('anniversary');
  const theme = isMedical ? { ...defaultTheme, name: 'Medical Blue', primary: '#0F766E', accent: '#2563EB' } : isGala ? { ...defaultTheme, name: 'Premium Gala', primary: '#B45309', secondary: '#111827', accent: '#F59E0B' } : defaultTheme;
  const sections = defaultSections.map((s) => {
    if (s.type === 'hero') return { ...s, data: { ...s.data, badge: isMedical ? 'Medical Congress' : isGala ? 'Gala Invitation' : 'Delfi Event', title: project.name, subtitle: prompt || 'Landing page generated by AI draft assistant.' } };
    if (s.type === 'about') return { ...s, data: { ...s.data, title: 'Tổng quan sự kiện', body: 'Nội dung được AI gợi ý theo mục tiêu, phong cách và chủ đề sự kiện. Team kỹ thuật có thể chỉnh lại từng section.' } };
    return s;
  });
  const resultJson = { theme, sections };
  await prisma.aiGeneration.create({ data: { projectId, prompt, resultJson } });
  await prisma.project.update({ where: { id: projectId }, data: { themeJson: theme, pageJson: { sections } } });
  revalidatePath(`/admin/projects/${projectId}/builder`);
}

export async function updateSections(projectId: number, formData: FormData) {
  await requireAdmin();
  try {
    const raw = cleanJsonInput(String(formData.get('pageJson') || '{}'));
    const parsed = normalizePageJson(JSON.parse(raw));
    await prisma.project.update({ where: { id: projectId }, data: { pageJson: parsed } });
    revalidatePath(`/admin/projects/${projectId}/builder`);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      revalidatePath(`/admin/preview/${project.slug}`);
      revalidatePath(`/${project.slug}`);
    }
  } catch (error) {
    console.error(`Invalid page JSON for project ${projectId}:`, error);
  }
}

export async function updateFormSchema(formId: number, formData: FormData) {
  await requireAdmin();
  try {
    const raw = cleanJsonInput(String(formData.get('schemaJson') || '{}'));
    const parsed = normalizeFormSchema(JSON.parse(raw));

    await prisma.eventForm.update({
      where: { id: formId },
      data: {
        name: resolveLocalizedText(parsed.title, 'vi', 'Registration Form'),
        schemaJson: parsed,
      },
    });

    const form = await prisma.eventForm.findUnique({ where: { id: formId } });
    if (!form) return;

    const project = await prisma.project.findUnique({ where: { id: form.projectId } });
    revalidatePath(`/admin/projects/${form.projectId}/forms`);
    revalidatePath(`/submit/${form.slug}`);
    if (project) revalidatePath(`/${project.slug}/register`);
  } catch (error) {
    console.error(`Invalid form schema for form ${formId}:`, error);
  }
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    redirect('/login?error=missing_credentials');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const isValidPassword = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || user.role !== 'admin' || !isValidPassword) {
    redirect('/login?error=invalid_credentials');
  }

  await createAdminSession(user.id);
  redirect('/admin');
}

export async function signOutAdmin() {
  await clearAdminSession();
  redirect('/login');
}

export async function submitRegistration(formId: number, formData: FormData) {
  const form = await prisma.eventForm.findUnique({ where: { id: formId } });
  if (!form) return;
  const schema = normalizeFormSchema(form.schemaJson as FormSchema);
  const data: Record<string, Prisma.InputJsonValue> = {};

  for (const step of schema.steps) {
    for (const field of step.fields) {
      if (field.type === 'file') {
        const value = formData.get(field.name);
        if (value instanceof File && value.size > 0) {
          data[field.name] = (await saveUploadedFile(form.projectId, form.id, field, value)) as Prisma.InputJsonValue;
        } else {
          data[field.name] = '';
        }
        continue;
      }

      if (field.type === 'checkbox') {
        if (field.options?.length) {
          data[field.name] = formData.getAll(field.name).map((value) => String(value));
        } else {
          data[field.name] = formData.has(field.name);
        }
        continue;
      }

      if (field.type === 'consent') {
        data[field.name] = formData.has(field.name);
        continue;
      }

      const value = formData.get(field.name);
      data[field.name] = value === null ? '' : String(value);
    }
  }

  await prisma.submission.create({
    data: {
      projectId: form.projectId,
      formId: form.id,
      dataJson: data as Prisma.InputJsonObject,
      sourceUrl: `/submit/${form.slug}`,
    },
  });
  redirect(`/submit/${form.slug}/success`);
}
