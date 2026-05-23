import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../../trpc";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  AuthServiceError,
} from "@repo/services/auth";

const TAGS = ["Authentication"];

const mapAuthError = (error: unknown): never => {
  if (error instanceof AuthServiceError) {
    throw new TRPCError({ code: error.code, message: error.message });
  }
  throw error;
};

export const authRouter = router({
  register: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/register", tags: TAGS } })
    .input(
      z.object({
        fullName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await registerUser(input);
      } catch (error) {
        return mapAuthError(error);
      }
    }),

  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/login", tags: TAGS } })
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .output(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await loginUser(input);
      } catch (error) {
        return mapAuthError(error);
      }
    }),

  logout: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/auth/logout", tags: TAGS } })
    .input(z.object({}))
    .output(z.object({ message: z.string() }))
    .mutation(({ ctx }) => logoutUser(ctx.token!)),

  me: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/auth/me", tags: TAGS } })
    .input(z.object({}))
    .output(
      z.object({
        id: z.string(),
        fullName: z.string(),
        email: z.string(),
        plan: z.string().nullable(),
      })
    )
    .query(({ ctx }) => getCurrentUser(ctx.user)),
});
