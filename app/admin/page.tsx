import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { prisma } from '@/lib/db';
import { ArrowRight, Bot, FileText, LayoutTemplate } from 'lucide-react';

export default async function DashboardPage() {
  const [projects, templates, submissions] = await Promise.all([prisma.project.count(), prisma.template.count(), prisma.submission.count()]);

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Dashboard' }]} />
      <div className="rounded-3xl bg-slate-950 p-8 text-white">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold text-blue-300">Internal Tool MVP</p>
            <h1 className="text-4xl font-black">Delfi Event Studio</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Tao landing page su kien, form dang ky multi-step, preview va export theo huong JSON schema-driven.</p>
          </div>
          <Link href="/admin/projects/new" className="btn-primary bg-white text-slate-950 hover:bg-slate-100">
            Tao project moi <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Stat icon={<FileText />} label="Projects" value={projects} />
        <Stat icon={<LayoutTemplate />} label="Templates" value={templates} />
        <Stat icon={<Bot />} label="Submissions" value={submissions} />
      </div>
      <div className="section-shell p-6">
        <h2 className="text-xl font-black">Luong MVP</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          {['Create Project', 'Edit Sections', 'Build Form', 'Preview', 'Publish/Export'].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="section-shell p-6">
      <div className="mb-4 text-blue-600">{icon}</div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm font-semibold text-slate-500">{label}</div>
    </div>
  );
}
