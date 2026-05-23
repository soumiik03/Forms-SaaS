import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { db, usersTable, userSessionsTable, type SelectUser } from "@repo/database";

export class AuthServiceError extends Error {
  constructor(
    readonly code: "CONFLICT" | "UNAUTHORIZED",
    message: string
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

const hashPassword = async (password: string) => bcrypt.hash(password, 12);

const verifyPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

const generateSessionToken = () => randomBytes(32).toString("hex");

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RegisterUserInput = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  plan: string | null;
};

export async function registerUser(input: RegisterUserInput) {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    throw new AuthServiceError("CONFLICT", "Email already registered");
  }

  const passwordHash = await hashPassword(input.password);

  await db.insert(usersTable).values({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
  });

  return { message: "Account created successfully" };
}

export async function loginUser(input: LoginUserInput) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, input.email))
    .limit(1);

  if (!user) {
    throw new AuthServiceError("UNAUTHORIZED", "Invalid email or password");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);

  if (!valid) {
    throw new AuthServiceError("UNAUTHORIZED", "Invalid email or password");
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(userSessionsTable).values({
    userId: user.id,
    token,
    expiresAt,
  });

  return { token };
}

export async function logoutUser(token: string) {
  await db
    .delete(userSessionsTable)
    .where(eq(userSessionsTable.token, token));

  return { message: "Logged out successfully" };
}

export function getCurrentUser(user: SelectUser): CurrentUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    plan: user.plan ?? null,
  };
}

export async function resolveUserFromToken(
  token: string | null | undefined
): Promise<SelectUser | null> {
  if (!token) return null;

  const result = await db
    .select({ user: usersTable })
    .from(userSessionsTable)
    .innerJoin(usersTable, eq(userSessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(userSessionsTable.token, token),
        gt(userSessionsTable.expiresAt, new Date())
      )
    )
    .limit(1);

  return result[0]?.user ?? null;
}
