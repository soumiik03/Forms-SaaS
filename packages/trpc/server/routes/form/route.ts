import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../../trpc";
import {
  createForm,
  getMyForms,
  updateForm,
  publishForm,
  unpublishForm,
  deleteForm,
  getFormBySlug,
  getPublicForms,
} from "@repo/services/form";
import { db, formFieldsTable, formsTable } from "@repo/database";
import { eq, and, asc, sql } from "drizzle-orm";

const TAGS = ["Forms"];

const formOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.string().nullable(),
  visibility: z.string().nullable(),
  createdAt: z.date().nullable(),
});

const formNotFound = () =>
  new TRPCError({ code: "NOT_FOUND", message: "Form not found" });

export const formRouter = router({
  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms", tags: TAGS } })
    .input(
      z.object({
        title: z.string().min(2).max(200),
        description: z.string().max(500).optional(),
      })
    )
    .output(formOutputSchema)
    .mutation(({ input, ctx }) => createForm(ctx.user.id, input)),

  getMyForms: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms/my", tags: TAGS } })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string().nullable(),
          slug: z.string(),
          status: z.string().nullable(),
          visibility: z.string().nullable(),
          submissionCount: z.number().nullable(),
          viewCount: z.number().nullable(),
          createdAt: z.date().nullable(),
          updatedAt: z.date().nullable(),
        })
      )
    )
    .query(({ ctx }) => getMyForms(ctx.user.id)),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/forms/{id}", tags: TAGS } })
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2).max(200).optional(),
        description: z.string().max(500).optional(),
        accentColor: z.string().optional(),
        successMessage: z.string().optional(),
      })
    )
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await updateForm(ctx.user.id, input);
      if (!form) throw formNotFound();
      return form;
    }),

  publish: protectedProcedure
    .meta({
      openapi: { method: "PATCH", path: "/forms/{id}/publish", tags: TAGS },
    })
    .input(
      z.object({
        id: z.string(),
        visibility: z.enum(["public", "unlisted"]),
      })
    )
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await publishForm(ctx.user.id, input);
      if (!form) throw formNotFound();
      return form;
    }),

  unpublish: protectedProcedure
    .meta({
      openapi: { method: "PATCH", path: "/forms/{id}/unpublish", tags: TAGS },
    })
    .input(z.object({ id: z.string() }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await unpublishForm(ctx.user.id, input.id);
      if (!form) throw formNotFound();
      return form;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/forms/{id}", tags: TAGS } })
    .input(z.object({ id: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const form = await deleteForm(ctx.user.id, input.id);
      if (!form) throw formNotFound();
      return { message: "Form deleted successfully" };
    }),

    getBySlug: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/{slug}", tags: TAGS } })
    .input(z.object({ slug: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      const form = await getFormBySlug(input.slug);
      if (!form) throw formNotFound();

      await db
        .update(formsTable)
        .set({ viewCount: sql`COALESCE(${formsTable.viewCount}, 0) + 1` })
        .where(eq(formsTable.id, form.id));

      const fields = await db
        .select()
        .from(formFieldsTable)
        .where(
          and(
            eq(formFieldsTable.formId, form.id),
            eq(formFieldsTable.isActive, true)
          )
        )
        .orderBy(asc(formFieldsTable.order));

      return {
        ...form,
        fields,
      };
    }),

  getPublicForms: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/explore", tags: TAGS } })
    .input(z.object({}))
    .output(z.any())
    .query(() => getPublicForms()),
});
