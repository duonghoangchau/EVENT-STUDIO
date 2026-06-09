import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { PreferenceLanguage, t } from '@/lib/preferences';

type ProjectSection = 'overview' | 'builder' | 'forms' | 'submissions';

const sectionOrder: Array<{ key: ProjectSection; translationKey: 'overview' | 'builder' | 'forms' | 'submissions'; href: (projectId: number) => string }> = [
  { key: 'overview', translationKey: 'overview', href: (projectId) => `/admin/projects/${projectId}` },
  { key: 'builder', translationKey: 'builder', href: (projectId) => `/admin/projects/${projectId}/builder` },
  { key: 'forms', translationKey: 'forms', href: (projectId) => `/admin/projects/${projectId}/forms` },
  { key: 'submissions', translationKey: 'submissions', href: (projectId) => `/admin/projects/${projectId}/submissions` },
];

export function AdminProjectNav({
  current,
  language,
  projectId,
  projectName,
  projectSlug,
}: {
  current: ProjectSection;
  language: PreferenceLanguage;
  projectId: number;
  projectName: string;
  projectSlug: string;
}) {
  const currentIndex = sectionOrder.findIndex((section) => section.key === current);
  const previous = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

  return (
    <div className="space-y-4">
      <AdminBreadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: t(language, 'projects'), href: '/admin/projects' },
          { label: projectName, href: `/admin/projects/${projectId}` },
          { label: t(language, sectionOrder.find((section) => section.key === current)?.translationKey || 'overview') },
        ]}
      />

      <div className="rounded-3xl border app-border app-surface-alt p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] app-muted">{t(language, 'projectWorkspace')}</div>
            <div className="mt-2 text-2xl font-black app-strong">{projectName}</div>
            <div className="mt-1 text-sm app-muted">/{projectSlug}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/admin/projects" className="btn-secondary">
              {t(language, 'backToProjects')}
            </Link>
            <Link href={`/${projectSlug}`} target="_blank" className="btn-secondary">
              {t(language, 'publicSite')}
            </Link>
            <Link href={`/admin/preview/${projectSlug}`} target="_blank" className="btn-secondary">
              {t(language, 'preview')}
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sectionOrder.map((section) => {
            const isActive = section.key === current;
            return (
              <Link
                key={section.key}
                href={section.href(projectId)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'app-inverse shadow-sm' : 'border app-border app-surface app-muted'
                }`}
              >
                {t(language, section.translationKey)}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t app-border pt-4">
          <div className="text-sm app-muted">{t(language, 'workflowHint')}</div>
          <div className="flex flex-wrap gap-2">
            {previous ? (
              <Link href={previous.href(projectId)} className="btn-secondary">
                {t(language, 'previous')}: {t(language, previous.translationKey)}
              </Link>
            ) : null}
            {next ? (
              <Link href={next.href(projectId)} className="btn-primary">
                {t(language, 'next')}: {t(language, next.translationKey)}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
