import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

export async function POST() {
  try {
    await dbConnect();

    const today = new Date();

    // جميع المهام الدورية التي حان موعدها
    const tasks = await Task.find({
      isRecurring: true,
      recurringActive: true,
      status: "terminee",
      nextExecution: { $lte: today },
    });

    for (const task of tasks) {
      // إنشاء مهمة جديدة
      await Task.create({
        client: task.client,
        service: task.service,

        clientPrice: task.clientPrice,
        employeePrice: task.employeePrice,

        createdBy: task.createdBy,

        dueDate: task.nextExecution,

        status: "nouvelle",

        notes: task.notes,

        isRecurring: task.isRecurring,
        recurrence: task.recurrence,

        recurringActive: true,

        lastExecution: null,
        nextExecution: null,
      });

      // حساب الموعد القادم للمهمة الأصلية
      const next = new Date(task.nextExecution!);

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

      await task.save();
    }

    return NextResponse.json({
      success: true,
      generated: tasks.length,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}