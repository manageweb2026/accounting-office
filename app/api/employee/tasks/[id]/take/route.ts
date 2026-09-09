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
    // ==========================================
    // الاتصال بقاعدة البيانات
    // ==========================================

    await dbConnect();

    // ==========================================
    // المستخدم الحالي
    // ==========================================

    const user = await getCurrentUser(request);

    console.log("=================================");
    console.log("TAKE TASK");
    console.log("User:", user);
    console.log("=================================");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non autorisé",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // الحصول على ID المهمة
    // ==========================================

    const { id } = await params;

    console.log("Task ID:", id);
    console.log("Employee ID:", user.id);

    // ==========================================
    // البحث عن المهمة
    // ==========================================

    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Tâche introuvable",
        },
        {
          status: 404,
        }
      );
    }

    console.log("Task status:", existingTask.status);
    console.log("Task employee:", existingTask.employee);

    // ==========================================
    // التحقق هل المهمة مأخوذة مسبقًا
    // ==========================================

    if (existingTask.employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Cette tâche est déjà prise",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // التحقق من حالة المهمة
    // ==========================================

    if (
      existingTask.status !== "nouvelle" &&
      existingTask.status !== "en_attente"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche ne peut pas être prise car son statut est : " +
            existingTask.status,
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // أخذ المهمة بشكل آمن
    // ==========================================

    const task = await Task.findOneAndUpdate(
      {
        _id: id,

        // المهمة لم يأخذها أي موظف
        employee: null,

        // السماح للحالتين
        status: {
          $in: ["nouvelle", "en_attente"],
        },
      },
      {
        $set: {
          employee: user.id,
          status: "en_cours",
          assignedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    // ==========================================
    // إذا فشل التحديث
    // ==========================================

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche vient probablement d'être prise par un autre employé.",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // نجاح
    // ==========================================

    console.log("Tâche prise avec succès:", task._id);
    console.log("Employé:", task.employee);
    console.log("Status:", task.status);

    return NextResponse.json({
      success: true,

      message: "Tâche prise avec succès",

      task: {
        _id: task._id,
        employee: task.employee,
        status: task.status,
        assignedAt: task.assignedAt,
      },
    });
  } catch (error) {
    console.error("=================================");
    console.error("ERREUR TAKE TASK");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,

        message: "Erreur serveur",

        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      {
        status: 500,
      }
    );
  }
}