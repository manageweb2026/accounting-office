import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

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

   // إذا استقبلنا عدة خدمات
if (body.services && Array.isArray(body.services)) {

  const tasks = body.services.map((service: any) => ({

    client: body.client,

    service: service._id,

    clientPrice: service.clientPrice,

    employeePrice: service.employeePrice,

    dueDate: body.dueDate,

    notes: body.notes,

    createdBy: user.id,

    status: "nouvelle",

  }));

  const createdTasks = await Task.insertMany(tasks);

  return NextResponse.json({
    success: true,
    tasks: createdTasks,
  });
}

// إنشاء مهمة واحدة (الطريقة القديمة)
const task = await Task.create({
  ...body,
  createdBy: user.id,
});

return NextResponse.json({
  success: true,
  task,
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

export async function GET() {
  try {
    await dbConnect();

    const tasks = await Task.find()
      .populate("client", "firstName lastName")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
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