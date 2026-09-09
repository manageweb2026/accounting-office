import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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
          message: "غير مصرح",
        },
        { status: 401 }
      );
    }

    const employeeId = new mongoose.Types.ObjectId(user.id);

    // ==========================================
    // 1️⃣ المهام الجديدة والمتاحة
    // ==========================================
    // nouvelle + لم يتم أخذها من أي موظف
    // نتحقق من employee غير موجود أو null

    const newTasks = await Task.countDocuments({
      status: "nouvelle",
      $or: [
        { employee: { $exists: false } },
        { employee: null },
      ],
    });

    // ==========================================
    // 2️⃣ المهام قيد الإنجاز للموظف الحالي
    // ==========================================

    const inProgressTasks = await Task.countDocuments({
      employee: employeeId,
      status: "en_cours",
    });

    // ==========================================
    // 3️⃣ المهام المنتهية للموظف الحالي
    // ==========================================

    const completedTasks = await Task.countDocuments({
      employee: employeeId,
      status: "terminee",
    });

    // ==========================================
    // 4️⃣ أرباح الموظف
    // ==========================================

    const profit = await Task.aggregate([
      {
        $match: {
          employee: employeeId,
          status: "terminee",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $ifNull: ["$employeePrice", 0],
            },
          },
        },
      },
    ]);

    const totalProfit = profit[0]?.total || 0;

    // ==========================================
    // DEBUG
    // ==========================================

    console.log("=================================");
    console.log("EMPLOYEE REPORT");
    console.log("USER ID:", user.id);
    console.log("NEW:", newTasks);
    console.log("IN PROGRESS:", inProgressTasks);
    console.log("COMPLETED:", completedTasks);
    console.log("PROFIT:", totalProfit);
    console.log("=================================");

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,
      report: {
        newTasks,
        inProgressTasks,
        completedTasks,
        profit: totalProfit,
      },
    });
  } catch (error) {
    console.error("❌ EMPLOYEE REPORT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}