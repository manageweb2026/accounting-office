import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { clientPromise } from "@/lib/mongodb";
import { sendResetPasswordEmail } from "@/lib/email";
import { NextRequest } from "next/server";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET!,

    baseURL: {
    allowedHosts: [
      "*.vercel.app",
      "localhost:*",
    ],
    protocol: "auto",
    fallback: process.env.BETTER_AUTH_URL!,
      },

  
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },

    revokeSessionsOnPasswordReset: true,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      niveau: {
        type: "string",
        required: true,
        defaultValue: "AGENT",
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },

      address: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },

      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },

  plugins: [
    admin({
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
  ],
});


/**
 * الحصول على المستخدم الحالي
 * باستخدام Better Auth Session
 */
export async function getCurrentUser(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}