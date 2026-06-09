import Link from 'next/link';
import { updateFormSchema } from '@/app/actions';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { FormSchemaEditor } from '@/components/form-schema-editor';
import { prisma } from '@/lib/db';
import { normalizeFormSchema } from '@/lib/form-schema';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { notFound } from 'next/navigation';

export default async function FormsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { forms: true } });

  if (!project) notFound();
  const preferences = await getServerPreferences({ defaultLanguage: project.language === 'en' ? 'en' : 'vi' });

  return (
    <div className="space-y-6">
      <AdminProjectNav current="forms" language={preferences.language} projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div>
        <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'formBuilder')}</h1>
        <p className="mt-2 app-muted">{t(preferences.language, 'formBuilderSummary')}</p>
      </div>

      {project.forms.map((form) => (
        <div key={form.id} className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/${project.slug}/register`} target="_blank" className="btn-secondary">
              {t(preferences.language, 'openPublicForm')}
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
