
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import ServicesClient from "@/models/ServicesClient";
import Task from "@/models/Task";

// ========================================
// نوع الخدمة بعد populate
// ========================================

type PopulatedService = {
  _id: string;

  name: string;

  description?: string;

  direction?: string;

  date_recurent?: string;

  date_limite?: string;

  Prix_Traitement_chifré?: number;

  Prix_Traitement_néant?: number;

  Prix_secretaireC?: number;

  Prix_secretaireN?: number;

  Prix_service_Agent?: number;

  Prix_Agent?: number;

  isRecurring: boolean;

  recurrence:
    | "mensuel"
    | "trimestriel"
    | "semestriel"
    | "annuel"
    | "ponctuel"
    | null;
};

// ========================================
// نوع طريقة الدفع بعد populate
// ========================================

type PopulatedPaymentMethod = {
  _id: string;
  name: string;
};

// ========================================
// GET
// يستخدمه Vercel Cron تلقائيًا
// ========================================

export async function GET(request: NextRequest) {
  return processServices();
}

// ========================================
// POST
// يستخدم للاختبار اليدوي
// ========================================

export async function POST(request: NextRequest) {
  return processServices();
}

// ========================================
// معالجة الخدمات
// ========================================

async function processServices() {
  try {
    await dbConnect();

    const now = new Date();

    console.log("================================");
    console.log("🔥 CRON / PROCESS STARTED");
    console.log("🔥 NOW:", now);
    console.log("================================");

    // ========================================
    // جلب الخدمات المستحقة
    // ========================================

    const servicesClients =
      await ServicesClient.find({
        active: true,

        datePayement: {
          $lte: now,
        },
      })
        .populate("service")
        .populate("paymentMethod");

    console.log(
      "🔥 SERVICES CLIENTS COUNT:",
      servicesClients.length
    );

    const createdTasks = [];

    // ========================================
    // معالجة كل خدمة
    // ========================================

    for (const servicesClient of servicesClients) {
      console.log("================================");

      console.log(
        "🔥 ServicesClient ID:",
        servicesClient._id
      );

      console.log(
        "🔥 Date:",
        servicesClient.datePayement
      );

      console.log(
        "🔥 Active:",
        servicesClient.active
      );

      console.log("================================");

      // ========================================
      // الخدمة بعد populate
      // ========================================

      const service =
        servicesClient.service as unknown as PopulatedService;

      // ========================================
      // التأكد من وجود الخدمة
      // ========================================

      if (
        !service ||
        !service._id
      ) {
        console.log(
          "❌ SERVICE NOT FOUND:",
          servicesClient._id
        );

        continue;
      }

      // ========================================
      // التأكد من وجود createdBy
      // ========================================

      if (!servicesClient.createdBy) {
        console.log(
          "❌ CREATED BY NOT FOUND:",
          servicesClient._id
        );

        continue;
      }

      // ========================================
      // طريقة الدفع بعد populate
      // ========================================

      const paymentMethod =
        servicesClient.paymentMethod as unknown as PopulatedPaymentMethod;

      if (
        !paymentMethod ||
        !paymentMethod._id
      ) {
        console.log(
          "❌ PAYMENT METHOD NOT FOUND:",
          servicesClient._id
        );

        continue;
      }

      // ========================================
      // الأسعار من Service الجديدة
      // ========================================

      const clientPrice =
        service.Prix_Traitement_chifré ?? 0;

      const employeePrice =
        service.Prix_Agent ?? 0;

      console.log(
        "💰 CLIENT PRICE:",
        clientPrice
      );

      console.log(
        "💰 EMPLOYEE PRICE:",
        employeePrice
      );

      // ========================================
      // منع إنشاء Task مكررة
      // ========================================

      const existingTask =
        await Task.findOne({
          client: servicesClient.client,

          service: service._id,

          status: {
            $in: [
              "nouvelle",
              "en_cours",
            ],
          },
        });

      // ========================================
      // إذا كانت هناك Task مفتوحة
      // ========================================

      if (existingTask) {
        console.log(
          "⚠️ TASK ALREADY EXISTS:",
          existingTask._id
        );

        // ====================================
        // إذا كانت الخدمة دورية
        // نحرك التاريخ للموعد القادم
        // ====================================

        if (
          service.isRecurring &&
          service.recurrence
        ) {
          const nextDate =
            calculateNextDate(
              servicesClient.datePayement,
              service.recurrence
            );

          servicesClient.datePayement =
            nextDate;

          await servicesClient.save();

          console.log(
            "🔄 EXISTING TASK - NEXT DATE:",
            nextDate
          );
        }

        continue;
      }

      // ========================================
      // حساب الموعد القادم
      // ========================================

      const nextExecution =
        service.isRecurring &&
        service.recurrence
          ? calculateNextDate(
              servicesClient.datePayement,
              service.recurrence
            )
          : null;

      // ========================================
      // إنشاء Task
      // ========================================

      const task =
        await Task.create({
          // -------------------------------
          // الزبون
          // -------------------------------

          client:
            servicesClient.client,

          // -------------------------------
          // الخدمة
          // -------------------------------

          service:
            service._id,

          // -------------------------------
          // السعر الذي يدفعه الزبون
          // -------------------------------

          clientPrice:
            clientPrice,

          // -------------------------------
          // أجر الموظف
          // -------------------------------

          employeePrice:
            employeePrice,

          // -------------------------------
          // الموظف
          // لا يوجد موظف بعد
          // -------------------------------

          employee:
            null,

          // -------------------------------
          // من أنشأ المهمة
          // -------------------------------

          createdBy:
            servicesClient.createdBy,

          // -------------------------------
          // تاريخ الاستحقاق
          // -------------------------------

          dueDate:
            servicesClient.datePayement,

          // -------------------------------
          // الحالة
          // -------------------------------

          status:
            "nouvelle",

          // -------------------------------
          // الملاحظات
          // -------------------------------

          notes:
            "",

          // -------------------------------
          // هل المهمة دورية؟
          // -------------------------------

          isRecurring:
            service.isRecurring,

          // -------------------------------
          // نوع الدورية
          // -------------------------------

          recurrence:
            service.isRecurring
              ? service.recurrence
              : null,

          // -------------------------------
          // هل الدورية فعالة؟
          // -------------------------------

          recurringActive:
            service.isRecurring,

          // -------------------------------
          // آخر تنفيذ
          // -------------------------------

          lastExecution:
            servicesClient.datePayement,

          // -------------------------------
          // التنفيذ القادم
          // -------------------------------

          nextExecution:
            nextExecution,

          // -------------------------------
          // تاريخ الإسناد
          // لا يوجد موظف بعد
          // -------------------------------

          assignedAt:
            null,

          // -------------------------------
          // طريقة الدفع
          // -------------------------------

          paymentMethod:
            paymentMethod._id,

          // -------------------------------
          // تاريخ الإنهاء
          // -------------------------------

          completedAt:
            null,
        });

      createdTasks.push(task);

      console.log(
        "✅ TASK CREATED:",
        task._id
      );

      // ========================================
      // الخدمة الدورية
      // ========================================

      if (
        service.isRecurring &&
        service.recurrence
      ) {
        servicesClient.datePayement =
          nextExecution!;

        await servicesClient.save();

        console.log(
          "🔄 RECURRING SERVICE"
        );

        console.log(
          "📅 CURRENT DATE:",
          servicesClient.datePayement
        );

        console.log(
          "📅 NEXT DATE:",
          nextExecution
        );
      }

      // ========================================
      // الخدمة غير الدورية
      // ========================================

      else {
        servicesClient.active =
          false;

        await servicesClient.save();

        console.log(
          "⛔ ONE TIME SERVICE DISABLED"
        );
      }
    }

    // ========================================
    // النتيجة
    // ========================================

    console.log("================================");

    console.log(
      "✅ PROCESS FINISHED"
    );

    console.log(
      "✅ CREATED TASKS:",
      createdTasks.length
    );

    console.log("================================");

    return NextResponse.json({
      success: true,

      message:
        "Traitement terminé avec succès",

      createdTasks,
    });

  } catch (error) {
    console.error(
      "❌ PROCESS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// حساب التاريخ القادم
// ========================================

function calculateNextDate(
  currentDate: Date,

  recurrence:
    | "mensuel"
    | "trimestriel"
    | "semestriel"
    | "annuel"
    | "ponctuel"
    | null
): Date {
  const date =
    new Date(currentDate);

  switch (recurrence) {

    // ====================================
    // شهري
    // ====================================

    case "mensuel":

      date.setUTCMonth(
        date.getUTCMonth() + 1
      );

      break;

    // ====================================
    // كل 3 أشهر
    // ====================================

    case "trimestriel":

      date.setUTCMonth(
        date.getUTCMonth() + 3
      );

      break;

    // ====================================
    // كل 6 أشهر
    // ====================================

    case "semestriel":

      date.setUTCMonth(
        date.getUTCMonth() + 6
      );

      break;

    // ====================================
    // سنوي
    // ====================================

    case "annuel":

      date.setUTCFullYear(
        date.getUTCFullYear() + 1
      );

      break;

    // ====================================
    // ponctuel
    // ====================================

    case "ponctuel":

      return currentDate;

    // ====================================
    // لا توجد دورية
    // ====================================

    default:

      return currentDate;
  }

  return date;
}

