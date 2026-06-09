import 'server-only';

import { randomBytes, createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';

const SESSION_COOKIE_NAME = 'delfi_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.adminSession.deleteMany({
      where: { sessionTokenHash: hashSessionToken(token) },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createAdminSession(userId: number) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: {
      userId,
      sessionTokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  await setSessionCookie(token, expiresAt);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { sessionTokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  if (session.user.role !== 'admin') {
    return null;
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect('/login');
  return user;
}
