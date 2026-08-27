import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import ServicesClient from "@/models/ServicesClient";
import Task from "@/models/Task";


// ========================================
// GET
// يستخدمه Vercel Cron تلقائيًا
// ========================================

export async function GET(request: NextRequest) {
  return processServices();
}


// ========================================
// POST
// يستخدم للاختبار اليدوي فقط
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
        .populate("client")
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


      const service = servicesClient.service;


      // ========================================
      // التأكد من وجود الخدمة
      // ========================================

      if (!service) {

        console.log(
          "❌ SERVICE NOT FOUND:",
          servicesClient._id
        );

        continue;
      }


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


      if (existingTask) {

        console.log(
          "⚠️ TASK ALREADY EXISTS:",
          existingTask._id
        );

        continue;
      }


      // ========================================
      // إنشاء Task
      // ========================================

      const task = await Task.create({

        client:
          servicesClient.client,

        service:
          service._id,

        clientPrice:
          servicesClient.clientPrice,

        employeePrice:
          servicesClient.employeePrice,

        createdBy:
          servicesClient.createdBy,

        status:
          "nouvelle",

        assignedAt:
          servicesClient.datePayement,

        dueDate:
          servicesClient.datePayement,

        paymentMethod:
          servicesClient.paymentMethod?._id,

        notes:
          "",

        isRecurring:
          service.isRecurring,

        recurrence:
          service.isRecurring
            ? service.recurrence
            : null,

        recurringActive:
          service.isRecurring
            ? true
            : false,

        lastExecution:
          servicesClient.datePayement,

        nextExecution:
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

      if (service.isRecurring) {

        const nextDate =
          calculateNextDate(
            servicesClient.datePayement,
            service.recurrence
          );


        servicesClient.datePayement =
          nextDate;


        await servicesClient.save();


        console.log(
          "🔄 RECURRING SERVICE"
        );

        console.log(
          "📅 NEXT DATE:",
          nextDate
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
          "Erreur serveur",
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
  recurrence: string | null
) {

  const date =
    new Date(currentDate);


  switch (recurrence) {

    case "mensuel":

      date.setUTCMonth(
        date.getUTCMonth() + 1
      );

      break;


    case "trimestriel":

      date.setUTCMonth(
        date.getUTCMonth() + 3
      );

      break;


    case "semestriel":

      date.setUTCMonth(
        date.getUTCMonth() + 6
      );

      break;


    case "annuel":

      date.setUTCFullYear(
        date.getUTCFullYear() + 1
      );

      break;


    default:

      return currentDate;
  }


  return date;
}