import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

import { getCurrentUser } from "@/lib/auth";

type Params = Promise<{
  id: string;
}>;

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {

    await dbConnect();

    
     console.log("Cookies:", request.cookies.getAll());

     console.log("Cookies TAKE:", request.cookies.getAll());

const user = getCurrentUser(request);

console.log("User TAKE:", user);

   

    console.log("User:", user);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Utilisateur non autorisé",
      });
    }

    const { id } = await params;

    // البحث عن المهمة
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({
        success: false,
        message: "Tâche introuvable",
      });
    }

    // إذا أخذها موظف آخر
    if (task.employee) {
      return NextResponse.json({
        success: false,
        message: "Cette tâche est déjà prise",
      });
    }

    task.employee = user.id;

    task.status = "en_cours";

    task.assignedAt = new Date();

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Tâche prise avec succès",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Erreur serveur",
    });

  }
}