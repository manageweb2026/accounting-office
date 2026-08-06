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
    const task = await Task.findById(id);

   
    if (!task) {
      return NextResponse.json({
        success: false,
        message: "المهمة غير موجودة",
      });
    }

    task.status = "terminee";
    task.completedAt = new Date();

    const today = new Date();

task.lastExecution = today;

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

  task.nextExecution = next;
}

    await task.save();

    return NextResponse.json({
      success: true,
      message: "تم إنهاء المهمة",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "خطأ في الخادم",
    });
  }
}