import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Client from "@/models/Client";
import Task from "@/models/Task";

type Params = Promise<{
  id: string;
}>;

// تعديل زبون
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();

    const client = await Client.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return NextResponse.json({
        success: false,
        message: "الزبون غير موجود",
      });
    }

    return NextResponse.json({
      success: true,
      client,
      message: "تم تعديل الزبون بنجاح",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء تعديل الزبون",
    });
  }
}

// حذف زبون
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    // 1️⃣ التأكد من وجود الزبون
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({
        success: false,
        message: "الزبون غير موجود",
      });
    }

    // 2️⃣ البحث عن عمل مُنجز لهذا الزبون
    const completedTask = await Task.findOne({
      client: id,
      status: { $in: ["terminee", "en_cours"] },
    });

    // 3️⃣ إذا كان لديه عمل مُنجز، نمنع الحذف
    if (completedTask) {
      return NextResponse.json({
        success: false,
        message:
          "Impossible de supprimer ce client car il possède un travail réalisé.",
      });
    }

    // 4️⃣ إذا لم يكن لديه عمل مُنجز، نحذفه
    await Client.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "تم حذف الزبون بنجاح",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء حذف الزبون",
    });
  }
}