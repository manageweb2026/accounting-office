import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/Users";

export async function GET() {
  try {
    await dbConnect();

    const admin = await User.findOne({
      username: "admin",
    });

    if (admin) {
      return NextResponse.json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      fullName: "مدير النظام",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      phone: "",
      email: "",
      address: "",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}