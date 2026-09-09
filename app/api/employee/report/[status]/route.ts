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

    // ==========================================
    // المستخدم الحالي
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

    const { status } = await params;

    // ==========================================
    // تحديد الفلتر حسب الحالة
    // ==========================================

    let filter: any = {};

    // ------------------------------------------
    // Nouvelles
    // ------------------------------------------

    if (status === "nouvelle") {
      filter = {
        status: "nouvelle",
        $or: [
          {
            employee: {
              $exists: false,
            },
          },
          {
            employee: null,
          },
        ],
      };
    }

    // ------------------------------------------
    // En cours / Terminées
    // ------------------------------------------

    else if (
      status === "en_cours" ||
      status === "terminee"
    ) {
      filter = {
        employee: user.id,
        status: status,
      };
    }

    // ------------------------------------------
    // حالة غير معروفة
    // ------------------------------------------

    else {
      return NextResponse.json(
        {
          success: false,
          message: "Statut invalide",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Debug
    // ==========================================

    console.log("=================================");
    console.log("EMPLOYEE REPORT DETAILS");
    console.log("USER:", user.id);
    console.log("STATUS:", status);
    console.log("FILTER:", JSON.stringify(filter));
    console.log("=================================");

    // ==========================================
    // جلب المهام
    // ==========================================

    const tasks = await Task.find(filter)
      .populate(
        "client",
        "firstName lastName nif nis na rc"
      )
      .populate(
        "service",
        "name"
      )
      .sort({
        assignedAt: 1,
      });

    // ==========================================
    // النتيجة
    // ==========================================

    console.log("TASKS COUNT:", tasks.length);

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error(
      "❌ EMPLOYEE REPORT STATUS ERROR:",
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