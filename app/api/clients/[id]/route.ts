import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Client from "@/models/Client";

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

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return NextResponse.json({
        success: false,
        message: "الزبون غير موجود",
      });
    }

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