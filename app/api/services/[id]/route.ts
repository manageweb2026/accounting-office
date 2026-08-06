import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

type Params = Promise<{
  id: string;
}>;

// تعديل خدمة
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();

    const service = await Service.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return NextResponse.json({
        success: false,
        message: "الخدمة غير موجودة",
      });
    }

    return NextResponse.json({
      success: true,
      service,
      message: "تم تعديل الخدمة بنجاح",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء تعديل الخدمة",
    });
  }
}

// حذف خدمة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json({
        success: false,
        message: "الخدمة غير موجودة",
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الخدمة بنجاح",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء حذف الخدمة",
    });
  }
}