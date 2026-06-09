import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';

type ProjectSection = 'overview' | 'builder' | 'forms' | 'submissions';

const sectionOrder: Array<{ key: ProjectSection; label: string; href: (projectId: number) => string }> = [
  { key: 'overview', label: 'Overview', href: (projectId) => `/admin/projects/${projectId}` },
  { key: 'builder', label: 'Builder', href: (projectId) => `/admin/projects/${projectId}/builder` },
  { key: 'forms', label: 'Forms', href: (projectId) => `/admin/projects/${projectId}/forms` },
  { key: 'submissions', label: 'Submissions', href: (projectId) => `/admin/projects/${projectId}/submissions` },
];

export function AdminProjectNav({
  current,
  projectId,
  projectName,
  projectSlug,
}: {
  current: ProjectSection;
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
          { label: 'Projects', href: '/admin/projects' },
          { label: projectName, href: `/admin/projects/${projectId}` },
          { label: sectionOrder.find((section) => section.key === current)?.label || 'Section' },
        ]}
      />

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Project workspace</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{projectName}</div>
            <div className="mt-1 text-sm text-slate-500">/{projectSlug}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/admin/projects" className="btn-secondary">
              Back to Projects
            </Link>
            <Link href={`/${projectSlug}`} target="_blank" className="btn-secondary">
              Public Site
            </Link>
            <Link href={`/admin/preview/${projectSlug}`} target="_blank" className="btn-secondary">
              Preview
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
                  isActive ? 'bg-slate-950 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="text-sm text-slate-500">Use Previous/Next to move through the project workflow without jumping back to the main menu.</div>
          <div className="flex flex-wrap gap-2">
            {previous ? (
              <Link href={previous.href(projectId)} className="btn-secondary">
                Previous: {previous.label}
              </Link>
            ) : null}
            {next ? (
              <Link href={next.href(projectId)} className="btn-primary">
                Next: {next.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
