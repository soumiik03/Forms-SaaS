import { z } from "zod"
import { router, protectedProcedure } from "../../trpc"
import { db, formFieldsTable, formsTable } from "@repo/database"
import { eq, and, asc } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

const TAGS = ["Form Fields"]

const fieldSchema = z.object({
  type: z.enum(["text", "email", "number", "textarea", 
                "select", "checkbox", "radio", "rating", "date"]),
  label: z.string().min(1).max(255),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number().default(0),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
  }).optional(),
})

export const fieldRouter = router({
  addField: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/fields", tags: TAGS } })
    .input(z.object({ formId: z.string() }).merge(fieldSchema))
    .output(z.any())
    .mutation(async ({ ctx, input }) => {
      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      }

      const newField = await db.insert(formFieldsTable).values({
        formId: input.formId,
        type: input.type,
        label: input.label,
        placeholder: input.placeholder,
        required: input.required,
        order: input.order,
        options: input.options,
        validation: input.validation,
      }).returning()

      return newField[0]
    }),

  updateField: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/fields/{fieldId}", tags: TAGS } })
    .input(z.object({ fieldId: z.string() }).merge(fieldSchema.partial()))
    .output(z.any())
    .mutation(async ({ ctx, input }) => {
      const field = await db.select().from(formFieldsTable)
        .where(eq(formFieldsTable.id, input.fieldId)).limit(1)

      if (field.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" })
      }

      if (!field[0].formId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Field has no associated form" })
      }

      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, field[0].formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

      const updatedField = await db.update(formFieldsTable)
        .set({
          ...(input.type && { type: input.type }),
          ...(input.label && { label: input.label }),
          ...(input.placeholder && { placeholder: input.placeholder }),
          ...(input.required !== undefined && { required: input.required }),
          ...(input.order !== undefined && { order: input.order }),
          ...(input.options && { options: input.options }),
          ...(input.validation && { validation: input.validation }),
        })
        .where(eq(formFieldsTable.id, input.fieldId))
        .returning()

      return updatedField[0]
    }),

  deleteField: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/fields/{fieldId}", tags: TAGS } })
    .input(z.object({ fieldId: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const field = await db.select().from(formFieldsTable)
        .where(eq(formFieldsTable.id, input.fieldId)).limit(1)

      if (field.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" })
      }

      if (!field[0].formId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Field has no associated form" })
      }

      const form = await db.select().from(formsTable)
        .where(and(
          eq(formsTable.id, field[0].formId),
          eq(formsTable.creatorId, ctx.user.id)
        )).limit(1)

      if (form.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your form" })
      }

      await db.update(formFieldsTable)
        .set({ isActive: false, deletedAt: new Date() })
        .where(eq(formFieldsTable.id, input.fieldId))

      return { message: "Field deleted" }
    }),

  getFormFields: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms/{formId}/fields", tags: TAGS } })
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

      return db.select().from(formFieldsTable)
        .where(and(
          eq(formFieldsTable.formId, input.formId),
          eq(formFieldsTable.isActive, true)
        ))
        .orderBy(asc(formFieldsTable.order))
    }),
})