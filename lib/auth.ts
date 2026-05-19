import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const TOKEN_NAME = "careernext_session";

export type AuthPayload = {
  userId: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload) {
  const secret = process.env.JWT_SECRET || "careernext-local-demo-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function setSessionCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function readAuth(request: NextRequest): AuthPayload | null {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const secret = process.env.JWT_SECRET || "careernext-local-demo-secret";
  if (!token) return null;

  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  cookies().delete(TOKEN_NAME);
}
