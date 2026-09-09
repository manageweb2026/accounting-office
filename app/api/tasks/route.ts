import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Client from "@/models/Client";
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

    // ==============================
    // Vérifier le client
    // ==============================

    const client = await Client.findById(body.client);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: "Client introuvable",
        },
        { status: 400 }
      );
    }

    // ==============================
    // Vérifier le mode de paiement
    // ==============================

    if (!body.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Mode de paiement obligatoire",
        },
        { status: 400 }
      );
    }

    // ==============================
    // Plusieurs services
    // ==============================

    if (body.services && Array.isArray(body.services)) {
      if (body.services.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Aucun service sélectionné",
          },
          { status: 400 }
        );
      }

      const tasks = body.services.map((service: any) => ({
        client: body.client,

        service: service._id,

        clientPrice: service.clientPrice,

        employeePrice: service.employeePrice,

        paymentMethod: body.paymentMethod,

        dueDate: body.dueDate,

        notes: body.notes || "",

        createdBy: user.id,

        status: "nouvelle",
      }));

      const createdTasks = await Task.insertMany(tasks);

      return NextResponse.json({
        success: true,
        tasks: createdTasks,
      });
    }

    // ==============================
    // Une seule tâche
    // ==============================

    const task = await Task.create({
      ...body,
      createdBy: user.id,
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("POST /api/tasks error:", error);

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
      .populate("employee", "firstName lastName")
      .populate("paymentMethod", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}