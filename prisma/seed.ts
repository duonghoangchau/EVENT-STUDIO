import { PrismaClient } from '@prisma/client';
import { defaultSections, defaultTheme, defaultFormSchema } from '../lib/defaults';
import { hashPassword } from '../lib/password';
import { templatePresets } from '../lib/template-presets';
const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@delfi.vn';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';
  const adminPasswordHash = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Delfi Admin', role: 'admin', passwordHash: adminPasswordHash },
    create: { name: 'Delfi Admin', email: adminEmail, role: 'admin', passwordHash: adminPasswordHash },
  });

  for (const template of templatePresets) {
    const existing = await prisma.template.findFirst({
      where: { name: template.name, category: template.category },
      orderBy: { id: 'asc' },
    });

    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: {
          themeJson: template.theme,
          templateJson: { sections: template.sections },
        },
      });
      continue;
    }

    await prisma.template.create({
      data: {
        name: template.name,
        category: template.category,
        themeJson: template.theme,
        templateJson: { sections: template.sections },
      },
    });
  }

  const project = await prisma.project.upsert({
    where: { slug: 'delfi-event-demo' },
    update: {},
    create: {
      name: 'Delfi Event Demo',
      slug: 'delfi-event-demo',
      description: 'Demo landing page generated from section schema.',
      language: 'vi',
      location: 'Ho Chi Minh City',
      themeJson: defaultTheme,
      pageJson: { sections: defaultSections },
      ownerId: admin.id,
    },
  });

  await prisma.eventForm.upsert({
    where: { slug: 'delfi-event-demo-registration' },
    update: {},
    create: { projectId: project.id, name: 'Main Registration', slug: 'delfi-event-demo-registration', schemaJson: defaultFormSchema },
  });
}

main().finally(() => prisma.$disconnect());
