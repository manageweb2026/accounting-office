

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";
import Task from "@/models/Task";
import {getCurrentUser} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser(request);
    

console.log("Current User:", currentUser);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Accès refusé" },
        { status: 403 }
      );
    }

    const employees = await User.find({
      role: "client",
    }).select("fullName");

    const reports = [];

    for (const employee of employees) {
      const newTasks = await Task.countDocuments({
      
        status: "nouvelle",
      });

      const inProgressTasks = await Task.countDocuments({
        employee: employee._id,
        status: "en_cours",
      });

      const completedTasks = await Task.countDocuments({
        employee: employee._id,
        status: "terminee",
      });

      const profit = await Task.aggregate([
        {
          $match: {
            employee: employee._id,
            status: "terminee",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$employeePrice",
            },
          },
        },
      ]);

      reports.push({
        id: employee._id,
        fullName: employee.fullName,
        newTasks,
        inProgressTasks,
        completedTasks,
        profit: profit[0]?.total || 0,
      });
    }

    return NextResponse.json({
      success: true,
      reports,
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