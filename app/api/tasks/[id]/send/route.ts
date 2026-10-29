
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    await dbConnect();

    // التحقق من تسجيل الدخول
   const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous devez vous connecter.",
        },
        { status: 401 }
      );
    }

    // التحقق من معرّف المهمة
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiant de tâche invalide.",
        },
        { status: 400 }
      );
    }

    // إرسال المهمة فقط إذا كانت جديدة وغير مستلمة
    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        status: "nouvelle",
        employee: null,
       sentToEmployee: { $ne: true },
      },
      {
        $set: {
          sentToEmployee: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tâche introuvable, déjà envoyée ou déjà prise.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tâche envoyée aux employés avec succès.",
      task,
    });
  } catch (error) {
    console.error("Erreur envoi tâche:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de l'envoi.",
      },
      { status: 500 }
    );
  }
}