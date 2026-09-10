import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    // البحث عن المهمة
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "المهمة غير موجودة",
        },
        { status: 404 }
      );
    }

    // التاريخ الحالي
    const today = new Date();

    // البيانات التي سيتم تحديثها
    const updateData: any = {
      status: "terminee",
      completedAt: today,
      lastExecution: today,
    };

    // ==========================================
    // إذا كانت المهمة متكررة
    // ==========================================

    if (task.isRecurring) {
      const next = new Date(today);

      switch (task.recurrence) {
        case "mensuel":
          next.setMonth(next.getMonth() + 1);
          break;

        case "trimestriel":
          next.setMonth(next.getMonth() + 3);
          break;

        case "semestriel":
          next.setMonth(next.getMonth() + 6);
          break;

        case "annuel":
          next.setFullYear(next.getFullYear() + 1);
          break;
      }

      updateData.nextExecution = next;
    }

    // ==========================================
    // تحديث المهمة مباشرة
    // ==========================================

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: false,
      }
    );

    if (!updatedTask) {
      return NextResponse.json(
        {
          success: false,
          message: "لم يتم العثور على المهمة",
        },
        { status: 404 }
      );
    }

    console.log("✅ Task completed:", {
      id: updatedTask._id,
      status: updatedTask.status,
      completedAt: updatedTask.completedAt,
    });

    return NextResponse.json({
      success: true,
      message: "تم إنهاء المهمة بنجاح",
      task: {
        _id: updatedTask._id,
        status: updatedTask.status,
        completedAt: updatedTask.completedAt,
        lastExecution: updatedTask.lastExecution,
        nextExecution: updatedTask.nextExecution,
      },
    });
  } catch (error) {
    console.error("❌ Complete task error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ في الخادم",
      },
      { status: 500 }
    );
  }
}