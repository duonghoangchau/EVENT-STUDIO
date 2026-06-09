import Link from 'next/link';
import { updateFormSchema } from '@/app/actions';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { FormSchemaEditor } from '@/components/form-schema-editor';
import { prisma } from '@/lib/db';
import { normalizeFormSchema } from '@/lib/form-schema';
import { notFound } from 'next/navigation';

export default async function FormsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { forms: true } });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <AdminProjectNav current="forms" projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div>
        <h1 className="text-3xl font-black">Form Builder</h1>
        <p className="mt-2 text-slate-500">Tuy chinh step, field, options va cach thu thap thong tin dang ky.</p>
      </div>

      {project.forms.map((form) => (
        <div key={form.id} className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/${project.slug}/register`} target="_blank" className="btn-secondary">
              Open public form
            </Link>
          </div>
          <FormSchemaEditor
            action={updateFormSchema.bind(null, form.id)}
            formSlug={form.slug}
            formTitle={form.name}
            initialSchema={normalizeFormSchema(form.schemaJson)}
          />
        </div>
      ))}
    </div>
  );
}
