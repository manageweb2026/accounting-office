import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";

// جلب جميع المستخدمين
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب المستخدمين",
    });
  }
}

// إضافة مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const {
      fullName,
      username,
      password,
      role,
      phone,
      email,
      address,
    } = await request.json();

    // التحقق من وجود اسم المستخدم
    const exists = await User.findOne({ username });

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "اسم المستخدم مستخدم بالفعل",
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      password: hashedPassword,
      role,
      phone,
      email,
      address,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء المستخدم بنجاح",
      user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ في الخادم",
    });
  }
}

