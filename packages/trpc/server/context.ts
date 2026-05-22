import { db, usersTable, userSessionsTable } from "@repo/database"
import { eq, and, gt } from "drizzle-orm"
import type { Request, Response } from "express"

export async function createContext({ req, res }: { req: Request, res: Response }) {
  const token = req.headers["authorization"]?.split(" ")[1]

  if (!token) return { user: null, token: null }

  const result = await db
    .select({ user: usersTable })
    .from(userSessionsTable)
    .innerJoin(usersTable, eq(userSessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(userSessionsTable.token, token),
        gt(userSessionsTable.expiresAt, new Date()) // not expired
      )
    )
    .limit(1)

  const user = result[0]?.user ?? null
  return { user, token }
}

export type Context = Awaited<ReturnType<typeof createContext>>
