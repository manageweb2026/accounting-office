
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import PaymentMethod from "@/models/Modep";
import { getCurrentUser } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

// ========================================
// PATCH: تعديل مهمة موجودة
// ========================================
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    await dbConnect();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالدخول" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "معرف المهمة غير صالح" },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log("PATCH Task ID:", id);
    console.log("PATCH Received body:", body);

    const updateData: Record<string, any> = {};

    // التحقق من Assiette
    if (body.assiette !== undefined) {
      if (
        body.assiette === "" ||
        body.assiette === null ||
        !Number.isFinite(Number(body.assiette)) ||
        Number(body.assiette) < 0
      ) {
        return NextResponse.json(
          { message: "قيمة Assiette غير صحيحة" },
          { status: 400 }
        );
      }

      updateData.assiette = Number(body.assiette);
    }

    // التحقق من Montant
    if (body.montant !== undefined) {
      if (
        body.montant === "" ||
        body.montant === null ||
        !Number.isFinite(Number(body.montant)) ||
        Number(body.montant) < 0
      ) {
        return NextResponse.json(
          { message: "قيمة Montant غير صحيحة" },
          { status: 400 }
        );
      }

      updateData.montant = Number(body.montant);
    }

    // التحقق من PaymentMethod
    if (body.paymentMethod !== undefined) {
      const paymentMethodId =
        typeof body.paymentMethod === "object"
          ? body.paymentMethod?._id
          : body.paymentMethod;

      if (!mongoose.Types.ObjectId.isValid(paymentMethodId)) {
        return NextResponse.json(
          { message: "طريقة الدفع غير صالحة" },
          { status: 400 }
        );
      }

      const method = await PaymentMethod.findOne({
        _id: paymentMethodId,
        isActive: true,
      });

      if (!method) {
        return NextResponse.json(
          { message: "طريقة الدفع غير موجودة أو غير مفعلة" },
          { status: 400 }
        );
      }

      updateData.paymentMethod = method._id;
    }

    // تاريخ المهمة
    if (body.dueDate !== undefined) {
      const date = new Date(body.dueDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "تاريخ المهمة غير صالح" },
          { status: 400 }
        );
      }

      updateData.dueDate = date;
    }

    // الملاحظات
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "لم يتم إرسال أي بيانات للتعديل" },
        { status: 400 }
      );
    }

    // التأكد من وجود المهمة
    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return NextResponse.json(
        { message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    console.log("PATCH Update data:", updateData);

    // تحديث المهمة الموجودة
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        strict: false,
      }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { message: "تعذر تحديث المهمة" },
        { status: 500 }
      );
    }

    // إعادة قراءة المهمة من قاعدة البيانات للتحقق من الحفظ
    const savedTask = await Task.findById(id).lean();

    if (!savedTask) {
      return NextResponse.json(
        { message: "تعذر قراءة المهمة بعد التحديث" },
        { status: 500 }
      );
    }

    console.log("PATCH Saved values:", {
      assiette: savedTask.assiette,
      montant: savedTask.montant,
      paymentMethod: savedTask.paymentMethod,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم تعديل المهمة وحفظ البيانات بنجاح",
        task: savedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تعديل المهمة",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE: إلغاء المهمة
// ========================================
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    await dbConnect();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالدخول" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "معرف المهمة غير صالح" },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    // حالات المهمة حسب TaskSchema
    if (task.employee || task.status === "terminee") {
      return NextResponse.json(
        {
          message:
            "لا يمكن إلغاء المهمة لأنها استُلمت من الموظف أو انتهت",
        },
        { status: 400 }
      );
    }

    // إلغاء المهمة دون حذفها
    task.status = "annulee";
    task.sentToEmployee = false;

    await task.save();

    return NextResponse.json(
      {
        success: true,
        message: "تم إلغاء المهمة بنجاح",
        task,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إلغاء المهمة",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
