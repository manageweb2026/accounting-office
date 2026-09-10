import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
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
    // جلب جميع الموظفين
    // ==========================================
    const employees = await User.find({
      role: "user",
      niveau: "AGENT",
    }).select(
      "_id name email image phone address role niveau isActive"
    );

    console.log("Employees found:", employees.length);

    // ==========================================
    // إنشاء التقرير لكل موظف
    // ==========================================
    const reports = await Promise.all(
      employees.map(async (employee) => {
        const tasks = await Task.find({
          employee: employee._id,
        });

        // -------------------------------
        // المهام الجديدة
        // -------------------------------
        const newTasks = tasks.filter(
          (task) => task.status === "nouvelle"
        ).length;

        // -------------------------------
        // المهام قيد الإنجاز
        // -------------------------------
        const inProgressTasks = tasks.filter(
          (task) => task.status === "en_cours"
        ).length;

        // -------------------------------
        // المهام المنتهية
        // -------------------------------
        const completedTasks = tasks.filter(
          (task) => task.status === "terminee"
        ).length;

        // -------------------------------
        // أجر الموظف
        // المهام المنتهية فقط
        // -------------------------------
        const profit = tasks
          .filter((task) => task.status === "terminee")
          .reduce(
            (sum, task) => sum + (Number(task.employeePrice) || 0),
            0
          );

        return {
          id: employee._id.toString(),

          name: employee.name || "",

          email: employee.email || "",

          image: employee.image || "",

          phone: employee.phone || "",

          address: employee.address || "",

          role: employee.role || "user",

          niveau: employee.niveau || "AGENT",

          isActive: employee.isActive ?? true,

          newTasks,

          inProgressTasks,

          completedTasks,

          profit,
        };
      })
    );

    // ==========================================
    // النتيجة
    // ==========================================
    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Reports API Error:", error);

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