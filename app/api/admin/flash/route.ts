import { clearAdminFlash } from '@/lib/admin-flash';
import { NextResponse } from 'next/server';

export async function POST() {
  await clearAdminFlash();
  return NextResponse.json({ ok: true });
}
