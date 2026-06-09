import { createProject } from '@/app/actions';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Projects', href: '/admin/projects' }, { label: 'New project' }]} />
      <h1 className="text-3xl font-black">Tao event project</h1>
      <form action={createProject} className="section-shell mt-6 space-y-5 p-6">
        <div>
          <label className="label">Ten su kien</label>
          <input name="name" className="input mt-2" placeholder="VIDEC 2026" required />
        </div>
        <div>
          <label className="label">Slug</label>
          <input name="slug" className="input mt-2" placeholder="videc-2026" />
        </div>
        <div>
          <label className="label">Dia diem</label>
          <input name="location" className="input mt-2" placeholder="Ho Chi Minh City" />
        </div>
        <div>
          <label className="label">Mo ta</label>
          <textarea name="description" className="input mt-2" rows={4} placeholder="Landing page hoi nghi..." />
        </div>
        <button className="btn-primary w-full">Tao project</button>
      </form>
    </div>
  );
}
