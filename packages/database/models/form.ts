import { pgTable, uuid, varchar, text, boolean, 
         integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { usersTable } from "./user"


export const formStatusEnum = pgEnum("form_status", ["draft", "published"])
export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"])
export const formFieldTypeEnum = pgEnum("form_field_type", ["text", "email", "select", "number", "textarea", "checkbox", "radio", "rating", "date"])

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug").notNull().unique(),
    title: varchar("title").notNull(),
    description: text("description"),
    creatorId: uuid("creator_id").references(() => usersTable.id, { onDelete: "cascade" }),
    status: formStatusEnum("status").default("draft"),
    visibility: formVisibilityEnum("visibility").default("unlisted"),
    accentColor: varchar("accent_color"),
    successMessage: text("success_message"),
    createdAt: timestamp("created_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    isActive: boolean("is_active").default(true)
})
export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id, { onDelete: "cascade" }),
    type: formFieldTypeEnum("type"),
    label: varchar("label").notNull(),
    required: boolean("required").default(false),
    order: integer("order"),
    options: jsonb("options"),
    validation: jsonb("validation"),
    deletedAt: timestamp("deleted_at"),
    isActive: boolean("is_active").default(true),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})

export const formResponsesTable = pgTable("form_responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id, { onDelete: "cascade" }),
    answers: jsonb("answers"),
    respondentEmail: varchar("respondent_email"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
    isActive: boolean("is_active").default(true)
})
export const userSessionsTable = pgTable("user_sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    token: varchar("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    deletedAt: timestamp("deleted_at"),
    isActive: boolean("is_active").default(true)
})    

