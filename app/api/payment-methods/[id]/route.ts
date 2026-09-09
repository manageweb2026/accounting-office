import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import PaymentMethod from "@/models/Modep";

type Params = Promise<{
  id: string;
}>;

// تعديل
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();

    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      id,
      {
        name: body.name,
        isActive: body.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "طريقة الدفع غير موجودة",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentMethod,
      message: "تم تعديل طريقة الدفع بنجاح",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تعديل طريقة الدفع",
      },
      { status: 500 }
    );
  }
}

// حذف
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "طريقة الدفع غير موجودة",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف طريقة الدفع بنجاح",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء حذف طريقة الدفع",
      },
      { status: 500 }
    );
  }
}