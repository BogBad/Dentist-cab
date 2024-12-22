import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  const salt = process.env.NEXT_PUBLIC_HASH_SALT as string;
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};
