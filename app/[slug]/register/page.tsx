import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicRegisterRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, include: { forms: true } });

  const formSlug = project?.forms[0]?.slug;
  if (!formSlug) redirect('/');

  redirect(`/submit/${formSlug}`);
}
