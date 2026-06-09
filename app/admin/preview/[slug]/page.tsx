import { prisma } from '@/lib/db';
import { normalizePageJson } from '@/lib/page-schema';
import { LandingRenderer } from '@/lib/renderer';
import { ThemeConfig } from '@/lib/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, include: { forms: true } });
  if (!project) notFound();

  const pageJson = normalizePageJson(project.pageJson);
  const theme = project.themeJson as ThemeConfig;
  return <LandingRenderer sections={pageJson.sections} theme={theme} formSlug={project.forms[0]?.slug} projectSlug={project.slug} />;
}
