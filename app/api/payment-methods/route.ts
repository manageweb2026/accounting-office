import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import PaymentMethod from "@/models/Modep";

// GET
export async function GET() {
  try {
    await dbConnect();

    const paymentMethods = await PaymentMethod.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء جلب طرق الدفع",
      },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const paymentMethod = await PaymentMethod.create({
      name: body.name,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      paymentMethod,
      message: "تم إنشاء طريقة الدفع بنجاح",
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "طريقة الدفع موجودة بالفعل",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء طريقة الدفع",
      },
      { status: 500 }
    );
  }
}