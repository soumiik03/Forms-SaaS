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
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.slug, input.formSlug),
          eq(formsTable.isActive, true)
        )).limit(1)

      const foundForm = form[0]
      if (!foundForm) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      if (foundForm.status !== "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Form is not published" })
      }

      const requiredFields = await db.select().from(formFieldsTable)
        .where(and(
          eq(formFieldsTable.formId, foundForm.id),
          eq(formFieldsTable.required, true),
          eq(formFieldsTable.isActive, true)
        ))

      for (const field of requiredFields) {
        const answer = input.answers[field.id]
        if (answer === undefined || answer === null || answer === "") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Missing answer for required field: ${field.label}`,
          })
        }
      }

      await db.insert(formResponsesTable).values({
        formId: foundForm.id,
        answers: input.answers,
        respondentEmail: input.respondentEmail,
        respondentName: input.respondentName,
      })

      await db.update(formsTable)
        .set({ submissionCount: sql`${formsTable.submissionCount} + 1` })
        .where(eq(formsTable.id, foundForm.id))

      return { message: "Response submitted successfully" }
    }),

  getResponses: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/responses/{formId}", tags: TAGS } })
    .input(z.object({ formId: z.string() }))
    .output(z.array(z.any()))
    .query(async ({ ctx, input }) => {
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

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
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      const foundForm = form[0]
      if (!foundForm) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

      const totalResponses = foundForm.submissionCount ?? 0
      const totalViews = foundForm.viewCount ?? 0

      const completionRate = totalViews > 0
        ? Math.round((totalResponses / totalViews) * 100)
        : 0

      return { totalResponses, totalViews, completionRate }
    }),
})