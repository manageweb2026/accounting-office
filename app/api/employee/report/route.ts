import { NextRequest, NextResponse } from "next/server";


import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";
 export const dynamic = "force-dynamic";
 
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
   

    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح",
        },
        { status: 401 }
      );
    }


     const newTasks = await Task.countDocuments({
      status: "nouvelle",
      
    });



    const inProgressTasks = await Task.countDocuments({
      employee: user.id,
      status: "en_cours",
    });

   

    const completedTasks = await Task.countDocuments({
      employee: user.id,
      status: "terminee",
    });



const profit = await Task.aggregate([
  {
    $match: {
      employee: new mongoose.Types.ObjectId(user.id),
      status: "terminee",
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$employeePrice" },
    },
  },
]);

    console.log("USER ID:", user.id);

console.log({
  newTasks,
  inProgressTasks,
  completedTasks,
  profit,
});

    return NextResponse.json({
      success: true,

      report: {
        newTasks,
        inProgressTasks,
        completedTasks,
        profit: profit[0]?.total || 0,
      },
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