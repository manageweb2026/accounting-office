import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

// جلب جميع الخدمات
export async function GET() {
  try {
    await dbConnect();

    const services = await Service.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      services,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب الخدمات",
    });
  }
}


// إضافة خدمة
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

   const {
  name,
  description,
  clientPrice,
  employeePrice,
  isActive,
  isRecurring,
  recurrence,
} = body;

console.log({
  name,
  description,
  clientPrice,
  employeePrice,
  isActive,
  isRecurring,
  recurrence,
});

const service = await Service.create({
  name,
  description,
  clientPrice,
  employeePrice,
  isActive,
  isRecurring,
  recurrence,
});
    return NextResponse.json({
      success: true,
      service,
      message: "تمت إضافة الخدمة بنجاح",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء إضافة الخدمة",
    });
  }
}