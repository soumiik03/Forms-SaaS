import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Email to creator when someone submits their form
export async function sendCreatorNotification({
  creatorEmail,
  creatorName,
  formTitle,
  responseCount,
  formSlug,
}: {
  creatorEmail: string
  creatorName: string
  formTitle: string
  responseCount: number
  formSlug: string
}) {
  await resend.emails.send({
    from: "Formulate <notifications@formulate.app>",
    to: creatorEmail,
    subject: `New response on "${formTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#080808;color:#F0EAD6">
        <h1 style="font-size:24px;font-weight:800;margin-bottom:8px;color:#F0EAD6">
          New response received
        </h1>
        <p style="color:rgba(240,234,214,0.6);margin-bottom:32px">
          Someone just submitted your form <strong style="color:#B8FF35">${formTitle}</strong>.
        </p>
        <div style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;margin-bottom:28px">
          <div style="font-size:13px;color:rgba(240,234,214,0.4);margin-bottom:4px">Total responses</div>
          <div style="font-size:40px;font-weight:800;color:#B8FF35">${responseCount}</div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/responses"
          style="display:inline-block;padding:12px 28px;background:#B8FF35;color:#000;font-weight:700;text-decoration:none;border-radius:8px;font-size:14px">
          View responses →
        </a>
        <p style="margin-top:40px;font-size:12px;color:rgba(240,234,214,0.25)">
          Formulate · You are receiving this because you created a form on Formulate.
        </p>
      </div>
    `,
  })
}

// Email to respondent confirming their submission
export async function sendRespondentConfirmation({
  respondentEmail,
  formTitle,
}: {
  respondentEmail: string
  formTitle: string
}) {
  await resend.emails.send({
    from: "Formulate <notifications@formulate.app>",
    to: respondentEmail,
    subject: `Your response to "${formTitle}" was received`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#080808;color:#F0EAD6">
        <h1 style="font-size:24px;font-weight:800;margin-bottom:8px;color:#F0EAD6">
          Response received ✓
        </h1>
        <p style="color:rgba(240,234,214,0.6);margin-bottom:32px">
          Your response to <strong style="color:#B8FF35">${formTitle}</strong> has been recorded successfully.
        </p>
        <p style="font-size:13px;color:rgba(240,234,214,0.4)">
          Thank you for taking the time to fill out this form.
        </p>
        <p style="margin-top:40px;font-size:12px;color:rgba(240,234,214,0.25)">
          Formulate · This confirmation was sent because you submitted a form on Formulate.
        </p>
      </div>
    `,
  })
}