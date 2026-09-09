import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

function getNextDate(
  date: Date,
  recurrence: string | null
): Date {
  const next = new Date(date);

  switch (recurrence) {
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

  return next;
}

export async function POST() {
  try {
    await dbConnect();

    const today = new Date();

    const recurringTasks = await Task.find({
      isRecurring: true,
      recurringActive: true,
      status: "terminee",
      nextExecution: { $lte: today },
    });

    let generatedCount = 0;

    for (const task of recurringTasks) {
      if (!task.nextExecution) {
        continue;
      }

      let executionDate = new Date(task.nextExecution);

      // إنشاء جميع الدورات التي فاتت
      while (executionDate <= today) {
        const existingTask = await Task.findOne({
          client: task.client,
          service: task.service,
          dueDate: executionDate,
        });

        if (!existingTask) {
          await Task.create({
            client: task.client,
            service: task.service,

            clientPrice: task.clientPrice,
            employeePrice: task.employeePrice,

            createdBy: task.createdBy,

              paymentMethod: task.paymentMethod,

            dueDate: executionDate,

            status: "nouvelle",

            notes: task.notes,

            isRecurring: task.isRecurring,
            recurrence: task.recurrence,

            recurringActive: true,

            lastExecution: null,
            nextExecution: null,

            employee: null,
            assignedAt: null,
            completedAt: null,
          });

          generatedCount++;
        }

        executionDate = getNextDate(
          executionDate,
          task.recurrence
        );
      }

      task.nextExecution = executionDate;

      await task.save();
    }

    return NextResponse.json({
      success: true,
      generated: generatedCount,
    });

  } catch (error) {
    console.error(
      "Generate recurring tasks error:",
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