import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const currentUser = getCurrentUser(request);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Accès refusé",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    const employee = await User.findById(id).select(
      "fullName phone email address"
    );

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employé introuvable",
        },
        {
          status: 404,
        }
      );
    }

    const tasks = await Task.find({
      employee: id,
    })
      .populate("client")
      .populate("service")
      .populate("createdBy", "fullName")
      .sort({
        createdAt: -1,
      });

    const newTasks = tasks.filter(
      (t) => t.status === "nouvelle"
    ).length;

    const inProgressTasks = tasks.filter(
      (t) => t.status === "en_cours"
    ).length;

    const completedTasks = tasks.filter(
      (t) => t.status === "terminee"
    ).length;

    const profit = tasks
      .filter((t) => t.status === "terminee")
      .reduce(
        (sum, task) => sum + task.employeePrice,
        0
      );

    return NextResponse.json({
      success: true,

      employee,

      summary: {
        newTasks,
        inProgressTasks,
        completedTasks,
        profit,
      },

      tasks,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}