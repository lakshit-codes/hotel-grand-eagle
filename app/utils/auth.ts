import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-for-development-only-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (e) {
        return null;
    }
}

export async function getSession() {
  const c = await cookies();
  const session = c.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function login(user: any) {
  const c = await cookies();
  const session = await encrypt({ user });
  c.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  });
}

export async function logout() {
  const c = await cookies();
  c.delete('session');
}
