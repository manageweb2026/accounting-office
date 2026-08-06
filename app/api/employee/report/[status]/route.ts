import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";
import Client from "@/models/Client";
import Service from "@/models/Service";
 export const dynamic = "force-dynamic";

// إجبار تسجيل الـ Models
void Client;
void Service;
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ status: string }> }
) {
  try {
    await dbConnect();

    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non autorisé",
        },
        { status: 401 }
      );
    }

    const { status } = await params;

    let filter: any = {};

    if (status === "nouvelle") {
      filter = {
        status: "nouvelle",
        employee: { $exists: true },
      };
    } else {
      filter = {
        employee: user.id,
        status,
      };
    }

    console.log("USER:", user.id);
console.log("STATUS:", status);
console.log("FILTER:", filter);

    const tasks = await Task.find(filter)
      .populate("client", "firstName lastName")
      .populate("service", "name")
      .sort({
        dueDate: 1,
      });

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