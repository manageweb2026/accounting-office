import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// ==========================================
// PATCH
// تعديل المهمة / إعادة تفعيل مهمة ملغاة
// ==========================================

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    await dbConnect();

    // ==========================================
    // التحقق من المستخدم
    // ==========================================

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non autorisé",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Tâche introuvable",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // ==========================================
    // إعادة تفعيل مهمة ملغاة
    // ==========================================

   if (
  task.status === "annulee" &&
  body.reactivate === true
) {
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "nouvelle",
        employee: null,
        assignedAt: null,
        completedAt: null,
      },
    },
    {
      new: true,
    }
  );

  return NextResponse.json({
    success: true,
    message: "Tâche réactivée avec succès",
    task: updatedTask,
  });
}

    // ==========================================
    // لا يمكن تعديل مهمة استلمها موظف
    // ==========================================

    if (task.employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche a déjà été prise par un employé",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // لا يمكن تعديل مهمة منتهية
    // ==========================================

    if (task.status === "terminee") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche ne peut plus être modifiée",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // الحقول المسموح بتعديلها
    // ==========================================

    if (body.dueDate !== undefined) {
      task.dueDate = new Date(body.dueDate);
    }

    if (body.notes !== undefined) {
      task.notes = body.notes;
    }

    if (body.clientPrice !== undefined) {
      task.clientPrice = Number(body.clientPrice);
    }

    if (body.employeePrice !== undefined) {
      task.employeePrice = Number(body.employeePrice);
    }

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Tâche modifiée avec succès",
      task,
    });

  } catch (error) {
    console.error(
      "PATCH /api/tasks/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}


// ==========================================
// DELETE
// إلغاء المهمة
// ==========================================

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    await dbConnect();

    // ==========================================
    // التحقق من المستخدم
    // ==========================================

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non autorisé",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await Task.findById(id);

    // ==========================================
    // المهمة غير موجودة
    // ==========================================

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Tâche introuvable",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // لا يمكن إلغاء مهمة استلمها موظف
    // ==========================================

    if (task.employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Impossible d'annuler une tâche déjà prise par un employé",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // لا يمكن إلغاء مهمة منتهية
    // ==========================================

    if (task.status === "terminee") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche est déjà terminée",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // إذا كانت ملغاة مسبقًا
    // ==========================================

    if (task.status === "annulee") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cette tâche est déjà annulée",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // لا نحذف المهمة من MongoDB
    // فقط نغير حالتها
    // ==========================================

    task.status = "annulee";

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Tâche annulée avec succès",
      task,
    });

  } catch (error) {
    console.error(
      "DELETE /api/tasks/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}