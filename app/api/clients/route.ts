import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import dbConnect from "@/lib/mongodb";
import Client from "@/models/Client";

export async function GET() {
  try {
    await dbConnect();

    const clients = await Client.find();

    return NextResponse.json({
      success: true,
      clients,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب الزبائن",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const client = await Client.create(body);

    return NextResponse.json({
      success: true,
      client,
      message: "تمت إضافة الزبون بنجاح",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء إضافة الزبون",
    });
  }
}