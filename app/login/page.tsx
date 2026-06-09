import { signInAdmin } from '@/app/actions';
import { getCurrentAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

const errorMessages: Record<string, string> = {
  invalid_credentials: 'Email hoac mat khau khong dung.',
  missing_credentials: 'Vui long nhap day du email va mat khau.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentAdmin();
  if (user) redirect('/admin');

  const { error } = await searchParams;
  const message = error ? errorMessages[error] || 'Khong the dang nhap. Vui long thu lai.' : '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-slate-950 p-10 text-white">
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-blue-200">Admin access</div>
          <h1 className="mt-6 max-w-md text-4xl font-black leading-tight">Quan ly landing page, template va form dang ky trong mot khu admin rieng.</h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Route public chi hien thi landing page va form dang ky. Moi tac vu tao project, builder, template va submissions deu duoc bao ve bang phien dang nhap admin.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Public site: <code>/{'{project-slug}'}</code></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Public registration: <code>/{'{project-slug}'}/register</code></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Admin workspace: <code>/admin</code></div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-black text-slate-950">Dang nhap admin</h2>
            <p className="mt-2 text-sm text-slate-500">Su dung tai khoan admin da duoc seed vao he thong.</p>

            <form action={signInAdmin} className="mt-8 space-y-5">
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" className="input mt-2" placeholder="admin@delfi.vn" required />
              </div>
              <div>
                <label className="label">Mat khau</label>
                <input name="password" type="password" className="input mt-2" placeholder="Nhap mat khau admin" required />
              </div>

              {message ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div> : null}

              <button className="btn-primary w-full" type="submit">
                Dang nhap
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">Public visitors should use event URLs only, such as a project slug and its registration route.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
