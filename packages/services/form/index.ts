import { db, formsTable } from "@repo/database";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const generateSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${nanoid(6)}`;
};

export type CreateFormInput = {
  title: string;
  description?: string;
};

export type UpdateFormInput = {
  id: string;
  title?: string;
  description?: string;
  accentColor?: string;
  successMessage?: string;
};

export type PublishFormInput = {
  id: string;
  visibility: "public" | "unlisted";
};

export async function createForm(creatorId: string, input: CreateFormInput) {
  const slug = generateSlug(input.title);
  const [form] = await db
    .insert(formsTable)
    .values({
      title: input.title,
      description: input.description,
      slug,
      creatorId,
    })
    .returning();

  if (!form) {
    throw new Error("Failed to create form");
  }

  return form;
}

export async function getMyForms(creatorId: string) {
  return db
    .select()
    .from(formsTable)
    .where(
      and(eq(formsTable.creatorId, creatorId), eq(formsTable.isActive, true))
    );
}

export async function updateForm(creatorId: string, input: UpdateFormInput) {
  const [form] = await db
    .update(formsTable)
    .set({
      ...(input.title && { title: input.title }),
      ...(input.description && { description: input.description }),
      ...(input.accentColor && { accentColor: input.accentColor }),
      ...(input.successMessage && { successMessage: input.successMessage }),
    })
    .where(
      and(
        eq(formsTable.id, input.id),
        eq(formsTable.creatorId, creatorId),
        eq(formsTable.isActive, true)
      )
    )
    .returning();

  return form ?? null;
}

export async function publishForm(creatorId: string, input: PublishFormInput) {
  const [form] = await db
    .update(formsTable)
    .set({ status: "published", visibility: input.visibility })
    .where(
      and(eq(formsTable.id, input.id), eq(formsTable.creatorId, creatorId))
    )
    .returning();

  return form ?? null;
}

export async function unpublishForm(creatorId: string, formId: string) {
  const [form] = await db
    .update(formsTable)
    .set({ status: "draft" })
    .where(
      and(eq(formsTable.id, formId), eq(formsTable.creatorId, creatorId))
    )
    .returning();

  return form ?? null;
}

export async function deleteForm(creatorId: string, formId: string) {
  const [form] = await db
    .update(formsTable)
    .set({ isActive: false, deletedAt: new Date() })
    .where(
      and(eq(formsTable.id, formId), eq(formsTable.creatorId, creatorId))
    )
    .returning();

  return form ?? null;
}

export async function getFormBySlug(slug: string) {
  const [form] = await db
    .select()
    .from(formsTable)
    .where(
      and(
        eq(formsTable.slug, slug),
        eq(formsTable.isActive, true),
        eq(formsTable.status, "published")
      )
    )
    .limit(1);

  return form ?? null;
}

export async function getPublicForms() {
  return db
    .select()
    .from(formsTable)
    .where(
      and(
        eq(formsTable.status, "published"),
        eq(formsTable.visibility, "public"),
        eq(formsTable.isActive, true)
      )
    );
}
