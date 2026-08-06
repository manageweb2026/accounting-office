import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";

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

    const user = await User.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "الزبون غير موجود",
      });
    }

    return NextResponse.json({
      success: true,
      user,
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

    const user = await User.findByIdAndDelete(id);

    if (!user) {
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