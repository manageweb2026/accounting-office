import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // ==========================================
    // المستخدم الحالي
    // ==========================================
    const currentUser = await getCurrentUser(request);

    console.log("Current User:", currentUser);

    // ==========================================
    // المدير فقط
    // ==========================================
    if (!currentUser || currentUser.niveau !== "GERANT") {
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

    // ==========================================
    // ID الموظف
    // ==========================================
    const { id } = await params;

    // ==========================================
    // البحث عن الموظف
    // ==========================================
    const employee = await User.findOne({
      _id: id,
      role: "user",
      niveau: "AGENT",
    }).select(
      "_id name email image phone address role niveau isActive"
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

    // ==========================================
    // جلب مهام الموظف
    // ==========================================
    const tasks = await Task.find({
      employee: id,
    })
      .populate("client")
      .populate("service")
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    // ==========================================
    // حساب الإحصائيات
    // ==========================================
    const newTasks = tasks.filter(
      (task) => task.status === "nouvelle"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "en_cours"
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "terminee"
    ).length;

    // ==========================================
    // مجموع أجر الموظف
    // المهام المنتهية فقط
    // ==========================================
    const profit = tasks
      .filter((task) => task.status === "terminee")
      .reduce(
        (sum, task) => sum + (task.employeePrice || 0),
        0
      );

    // ==========================================
    // النتيجة
    // ==========================================
    return NextResponse.json({
      success: true,

      employee: {
        id: employee._id.toString(),
        name: employee.name || "",
        email: employee.email || "",
        image: employee.image || "",
        phone: employee.phone || "",
        address: employee.address || "",
        role: employee.role || "user",
        niveau: employee.niveau || "AGENT",
        isActive: employee.isActive ?? true,
      },

      summary: {
        newTasks,
        inProgressTasks,
        completedTasks,
        profit,
      },

      tasks,
    });
  } catch (error) {
    console.error("Employee Report API Error:", error);

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