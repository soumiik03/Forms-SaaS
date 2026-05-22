import { z } from "zod"
import { router, publicProcedure ,protectedProcedure} from "../../trpc"
import { db, usersTable, userSessionsTable } from "@repo/database"
import { hashPassword, verifyPassword, generateSessionToken } from "@repo/services/auth"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

const TAGS = ["Authentication"]

export const authRouter = router({
  register: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/register", tags: TAGS } })
    .input(z.object({
      fullName: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Check if email already exists
      const existing = await db.select().from(usersTable)
        .where(eq(usersTable.email, input.email))
        .limit(1)

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" })
      }

      //  Hash the password
      const passwordHash = await hashPassword(input.password)

      //  Save user to DB
      await db.insert(usersTable).values({
        fullName: input.fullName,
        email: input.email,
        passwordHash,
      })

      return { message: "Account created successfully" }
    }),

  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/login", tags: TAGS } })
    .input(z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })) 
    .output(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      // Find user by email
      const users = await db.select().from(usersTable)
        .where(eq(usersTable.email, input.email))
        .limit(1)
      if (users.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" })
      }
      const user = users[0]

      // Verify password
      const valid = await verifyPassword(input.password, user.passwordHash)

      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" })
      }
      //Generate session token
      const token = generateSessionToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      // Save session to DB
      await db.insert(userSessionsTable).values({
        userId: user.id,
        token,
        expiresAt,
      })
      return { token }
    }),

  logout: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/auth/logout", tags: TAGS } })
    .input(z.object({}))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ ctx }) => {
      await db.delete(userSessionsTable)
        .where(eq(userSessionsTable.token, ctx.token!))
      return { message: "Logged out successfully" }
    }),

me: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/auth/me", tags: TAGS } })
  .input(z.object({}))
  .output(z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    plan: z.string().nullable(),
  }))
  .query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      fullName: ctx.user.fullName,
      email: ctx.user.email,
      plan: ctx.user.plan ?? null,
    }
  }),
})
