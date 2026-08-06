import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "اسم المستخدم غير موجود",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        message: "كلمة المرور غير صحيحة",
      });
    }

    console.log("ROLE IN TOKEN:", user.role);
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    console.log("USER FROM DB:", user);

  const response = NextResponse.json({
  success: true,
  role: user.role,
});

response.cookies.set({
  name: "token",
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, // يوم واحد
});

return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ في الخادم",
    });
  }
}