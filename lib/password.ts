import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const SCRYPT_KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedKeyHex] = passwordHash.split(':');
  if (!salt || !storedKeyHex) return false;

  const derivedKey = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(storedKeyHex, 'hex');

  if (derivedKey.length !== storedKey.length) return false;
  return timingSafeEqual(derivedKey, storedKey);
}
