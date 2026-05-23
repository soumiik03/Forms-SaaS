import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const userSessionsTable = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  deletedAt: timestamp("deleted_at"),
  isActive: boolean("is_active").default(true),
});
