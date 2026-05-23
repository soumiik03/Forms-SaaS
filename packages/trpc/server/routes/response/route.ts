import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../../trpc"
import { db, formResponsesTable, formsTable, formFieldsTable } from "@repo/database"
import { eq, and, desc, sql } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

const TAGS = ["Responses"]

export const responseRouter = router({
  submit: publicProcedure
    .meta({ openapi: { method: "POST", path: "/responses/submit", tags: TAGS } })
    .input(z.object({
      formSlug: z.string(),
      answers: z.record(z.string(), z.any()),
      respondentEmail: z.string().email().optional(),
      respondentName: z.string().optional(),
    }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Find form by slug
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.slug, input.formSlug),
          eq(formsTable.isActive, true)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      // Check form is published
      if (form[0].status !== "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Form is not published" })
      }

      // Fetch all required fields
      const requiredFields = await db.select().from(formFieldsTable)
        .where(and(
          eq(formFieldsTable.formId, form[0].id),
          eq(formFieldsTable.required, true),
          eq(formFieldsTable.isActive, true)
        ))

      // Validate required fields have answers
      for (const field of requiredFields) {
        const answer = input.answers[field.id]
        if (answer === undefined || answer === null || answer === "") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Missing answer for required field: ${field.label}`,
          })
        }
      }

      // Insert response
      await db.insert(formResponsesTable).values({
        formId: form[0].id,
        answers: input.answers,
        respondentEmail: input.respondentEmail,
        respondentName: input.respondentName,
      })

      // Increment submission count atomically
      await db.update(formsTable)
        .set({ submissionCount: sql`${formsTable.submissionCount} + 1` })
        .where(eq(formsTable.id, form[0].id))

      return { message: "Response submitted successfully" }
    }),

  getResponses: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/responses/{formId}", tags: TAGS } })
    .input(z.object({ formId: z.string() }))
    .output(z.array(z.any()))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

      // Return responses newest first
      return db.select().from(formResponsesTable)
        .where(eq(formResponsesTable.formId, input.formId))
        .orderBy(desc(formResponsesTable.submittedAt))
    }),

  getAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/responses/{formId}/analytics", tags: TAGS } })
    .input(z.object({ formId: z.string() }))
    .output(z.object({
      totalResponses: z.number(),
      totalViews: z.number(),
      completionRate: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

      const totalResponses = form[0].submissionCount ?? 0
      const totalViews = form[0].viewCount ?? 0

      // Avoid division by zero
      const completionRate = totalViews > 0
        ? Math.round((totalResponses / totalViews) * 100)
        : 0

      return { totalResponses, totalViews, completionRate }
    }),
})