import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../../trpc"
import { db, formsTable } from "@repo/database"
import { eq, and } from "drizzle-orm"
import { TRPCError } from "@trpc/server"
import { nanoid } from "nanoid"

const TAGS = ["Forms"]

const generateSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${base}-${nanoid(6)}`
}

const formOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.string().nullable(),
  visibility: z.string().nullable(),
  createdAt: z.date().nullable(),
})

export const formRouter = router({
  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms", tags: TAGS } })
    .input(z.object({
      title: z.string().min(2).max(200),
      description: z.string().max(500).optional()
    }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title)
      const newForm = await db.insert(formsTable).values({
        title: input.title,
        description: input.description,
        slug,
        creatorId: ctx.user.id
      }).returning()
      return newForm[0]
    }),

  getMyForms: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms/my", tags: TAGS } })
    .input(z.object({}))
    .output(z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      slug: z.string(),
      status: z.string().nullable(),
      visibility: z.string().nullable(),
      submissionCount: z.number().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
    })))
    .query(async ({ ctx }) => {
      return db.select().from(formsTable)
        .where(and(
          eq(formsTable.creatorId, ctx.user.id),
          eq(formsTable.isActive, true)
        ))
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/forms/{id}", tags: TAGS } })
    .input(z.object({
      id: z.string(),
      title: z.string().min(2).max(200).optional(),
      description: z.string().max(500).optional(),
      accentColor: z.string().optional(),
      successMessage: z.string().optional()
    }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await db.update(formsTable)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.description && { description: input.description }),
          ...(input.accentColor && { accentColor: input.accentColor }),
          ...(input.successMessage && { successMessage: input.successMessage }),
        })
        .where(and(
          eq(formsTable.id, input.id),
          eq(formsTable.creatorId, ctx.user.id),
          eq(formsTable.isActive, true)
        ))
        .returning()

      if (updated.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      return updated[0]
    }),

  publish: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: "/forms/{id}/publish", tags: TAGS } })
    .input(z.object({
      id: z.string(),
      visibility: z.enum(["public", "unlisted"])
    }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await db.update(formsTable)
        .set({ status: "published", visibility: input.visibility })
        .where(and(
          eq(formsTable.id, input.id),
          eq(formsTable.creatorId, ctx.user.id)
        ))
        .returning()

      if (updated.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      return updated[0]
    }),

  unpublish: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: "/forms/{id}/unpublish", tags: TAGS } })
    .input(z.object({ id: z.string() }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await db.update(formsTable)
        .set({ status: "draft" })
        .where(and(
          eq(formsTable.id, input.id),
          eq(formsTable.creatorId, ctx.user.id)
        ))
        .returning()

      if (updated.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      return updated[0]
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/forms/{id}", tags: TAGS } })
    .input(z.object({ id: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updated = await db.update(formsTable)
        .set({ isActive: false, deletedAt: new Date() })
        .where(and(
          eq(formsTable.id, input.id),
          eq(formsTable.creatorId, ctx.user.id)
        ))
        .returning()

      if (updated.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      return { message: "Form deleted successfully" }
    }),

  getBySlug: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/{slug}", tags: TAGS } })
    .input(z.object({ slug: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.slug, input.slug),
          eq(formsTable.isActive, true),
          eq(formsTable.status, "published")
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      return form[0]
    }),

  getPublicForms: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/explore", tags: TAGS } })
    .input(z.object({}))
    .output(z.any())
    .query(async () => {
      return db.select().from(formsTable)
        .where(and(
          eq(formsTable.status, "published"),
          eq(formsTable.visibility, "public"),
          eq(formsTable.isActive, true)
        ))
    }),
})