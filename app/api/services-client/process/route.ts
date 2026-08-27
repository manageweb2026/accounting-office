import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import ServicesClient from "@/models/ServicesClient";
import Task from "@/models/Task";
import Service from "@/models/Service";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // ========================================
    // الخدمات التي حان موعـدها
    // ========================================
const allServicesClients =
  await ServicesClient.find({});

console.log(
  "🔥 ALL SERVICES CLIENTS COUNT:",
  allServicesClients.length
);

console.log(
  "🔥 ALL SERVICES CLIENTS:",
  allServicesClients
);
    const servicesClients =
      await ServicesClient.find({
        active: true,
        datePayement: {
          $lte: new Date(),
        },
      })
        .populate("service")
        .populate("client")
        .populate("paymentMethod");
console.log("🔥 NOW:", new Date());

console.log(
  "🔥 SERVICES CLIENTS COUNT:",
  servicesClients.length
);

console.log(
  "🔥 SERVICES CLIENTS:",
  servicesClients
);
    const createdTasks = [];

    // ========================================
    // معالجة كل خدمة
    // ========================================

   for (const servicesClient of servicesClients) {
  console.log("================================");
  console.log("ServicesClient ID:", servicesClient._id);
  console.log("Client:", servicesClient.client);
  console.log("Service:", servicesClient.service);
  console.log("PaymentMethod:", servicesClient.paymentMethod);
  console.log("Date:", servicesClient.datePayement);
  console.log("Active:", servicesClient.active);
  console.log("================================");

  const service = servicesClient.service;

  if (!service) {
    console.log(
      "❌ SERVICE NOT FOUND FOR:",
      servicesClient._id
    );

    continue;
  }

      // ========================================
      // منع إنشاء Task مكررة
      // ========================================

      const existingTask = await Task.findOne({
        client: servicesClient.client,
        service: service._id,
        status: {
          $in: ["nouvelle", "en_cours"],
        },
      });

      if (existingTask) {
        continue;
      }

      // ========================================
      // إنشاء Task
      // ========================================

      const task = await Task.create({
        client: servicesClient.client,

        service: service._id,

        clientPrice:
          servicesClient.clientPrice,

        employeePrice:
          servicesClient.employeePrice,

        createdBy:
          servicesClient.createdBy,

        status: "nouvelle",

        assignedAt:
          servicesClient.datePayement,

        dueDate:
          servicesClient.datePayement,

        paymentMethod:
          servicesClient.paymentMethod?._id,

        notes: "",

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

        nextExecution: null,
      });

      createdTasks.push(task);

      // ========================================
      // إذا كانت الخدمة دورية
      // نحسب التاريخ القادم
      // ========================================

      if (service.isRecurring) {
        const nextDate = calculateNextDate(
          servicesClient.datePayement,
          service.recurrence
        );

        servicesClient.datePayement =
          nextDate;

        await servicesClient.save();
      }

      // ========================================
      // إذا كانت غير دورية
      // نعطل الخدمة
      // ========================================

      else {
        servicesClient.active = false;

        await servicesClient.save();
      }
    }

    return NextResponse.json({
      success: true,

      message:
        "Traitement terminé avec succès",

      createdTasks,
    });

  } catch (error) {
    console.error(
      "POST /api/services-client/process error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
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
  const date = new Date(currentDate);

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