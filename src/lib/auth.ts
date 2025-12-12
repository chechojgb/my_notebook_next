import sql from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export interface User {
  id: number;
  name: string | null;
  email: string;
  email_verified_at: Date | null;
  created_at: Date;
}

export async function registerUser(email: string, password: string, name?: string) {
  // Check if user exists
  const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const result = await sql`
    INSERT INTO users (email, password, name, created_at, updated_at)
    VALUES (${email}, ${hashedPassword}, ${name || null}, NOW(), NOW())
    RETURNING id, email, name, created_at
  `;

  return result[0] as User;
}

export async function loginUser(email: string, password: string) {
  // Get user with password
  const users = await sql`
    SELECT id, email, password, name, email_verified_at, created_at
    FROM users 
    WHERE email = ${email}
  `;

  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = users[0];

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Create session token
  const sessionToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Store session in database (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await sql`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${user.id}, ${sessionToken}, ${expiresAt.toISOString()})
  `;

  // Set cookie
  (await cookies()).set({
    name: 'session_token',
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    email_verified_at: user.email_verified_at,
  } as User;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // Verify token
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as { userId: number };

    // Check session in database
    const sessions = await sql`
      SELECT s.*, u.id as user_id, u.email, u.name, u.email_verified_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
    `;

    if (sessions.length === 0) {
      return null;
    }

    const session = sessions[0];
    return {
      id: session.user_id,
      email: session.email,
      name: session.name,
      email_verified_at: session.email_verified_at,
    } as User;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (sessionToken) {
    // Delete session from database
    await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`;
  }

  // Clear cookie
  cookieStore.delete('session_token');
}