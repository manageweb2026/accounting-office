import { Resend } from "resend";

export async function sendResetPasswordEmail(
  email: string,
  url: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY غير موجود");
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <h2>Réinitialisation du mot de passe</h2>

      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>

      <p>
        <a href="${url}">
          Réinitialiser mon mot de passe
        </a>
      </p>
    `,
  });

  if (error) {
    console.error("ERREUR RESEND:", error);
    throw new Error(error.message);
  }

  console.log("EMAIL RESEND ENVOYÉ:", data);
}