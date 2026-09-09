import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";

import Task from "@/models/Task";
import Service from "@/models/Service";

import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
console.log("Cookies:", request.cookies.getAll());
    const user = getCurrentUser(request);

    

console.log("User:", user);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Utilisateur non autorisé",
      });
    }

    const body = await request.json();

    const service = await Service.findById(body.service);

    if (!service) {
      return NextResponse.json({
        success: false,
        message: "Service introuvable",
      });
    }

    const task = await Task.create({
      client: body.client,

      service: body.service,

      clientPrice: service.clientPrice,

      employeePrice: service.employeePrice,

      createdBy: user.id,

      dueDate: body.dueDate,

      notes: body.notes,

      status: "nouvelle",
    });

    return NextResponse.json({
      success: true,
      task,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Erreur serveur",
    });

  }
}

export async function GET() {
  try {
    await dbConnect();

   const tasks = await Task.find({
  status: "nouvelle",
})
  .populate(
    "client",
    "firstName lastName nif nis na rc"
  )
  .populate("service", "name")
  .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Erreur serveur",
    });

  }
}