import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Vérifier la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // 2. Vérifier le rôle
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Accès réservé aux administrateurs",
        },
        { status: 403 }
      );
    }

    // 3. Récupérer les données
    const body = await request.json();

    const { userId, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        {
          error: "ID utilisateur manquant.",
        },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          error: "Nouveau mot de passe obligatoire.",
        },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "Le mot de passe doit contenir au moins 8 caractères.",
        },
        { status: 400 }
      );
    }

    // 4. Better Auth
    await auth.api.setUserPassword({
      body: {
        userId,
        newPassword,
      },
      headers: await headers(),
    });

    // 5. Succès
    return NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès.",
    });
  } catch (error) {
    console.error("Erreur /api/admin/change-password:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur serveur.",
      },
      {
        status: 500,
      }
    );
  }
}