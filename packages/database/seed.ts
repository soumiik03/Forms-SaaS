import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, usersTable, formsTable, formFieldsTable } from "./index";
import { eq } from "drizzle-orm";

async function main() {
  const email = "demo@formulate.dev";
  const password = "demo123456";

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  const passwordHash = await bcrypt.hash(password, 10);

  const user =
    existingUser[0] ??
    (
      await db
        .insert(usersTable)
        .values({
          fullName: "Demo User",
          email,
          passwordHash,
          emailVerified: true,
          plan: "pro",
        })
        .returning()
    )[0];

  if (!user) throw new Error("Failed to create demo user");

  const slug = "customer-feedback-demo";

  const existingForm = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.slug, slug))
    .limit(1);

  const form =
    existingForm[0] ??
    (
      await db
        .insert(formsTable)
        .values({
          title: "Customer Feedback Demo",
          description: "A demo form for testing public submissions.",
          slug,
          creatorId: user.id,
          status: "published",
          visibility: "public",
          accentColor: "#b8ff35",
          successMessage: "Thanks for your feedback!",
        })
        .returning()
    )[0];

  if (!form) throw new Error("Failed to create demo form");

  const existingFields = await db
    .select()
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, form.id))
    .limit(1);

  if (existingFields.length === 0) {
    await db.insert(formFieldsTable).values([
      {
        formId: form.id,
        type: "text",
        label: "Full Name",
        placeholder: "Jane Doe",
        required: true,
        order: 0,
      },
      {
        formId: form.id,
        type: "email",
        label: "Email",
        placeholder: "jane@example.com",
        required: true,
        order: 1,
      },
      {
        formId: form.id,
        type: "rating",
        label: "How was your experience?",
        required: true,
        order: 2,
      },
      {
        formId: form.id,
        type: "textarea",
        label: "Additional feedback",
        placeholder: "Tell us more...",
        required: false,
        order: 3,
      },
    ]);
  }

  console.log("Seed complete");
  console.log(`Demo email: ${email}`);
  console.log(`Demo password: ${password}`);
  console.log(`Demo form: http://localhost:3000/f/${slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});