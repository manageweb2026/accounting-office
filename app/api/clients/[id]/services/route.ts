import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Client from "@/models/Client";
import ServicesClient from "@/models/ServicesClient";
import Service from "@/models/Service";
import PaymentMethod from "@/models/Modep";
import { getCurrentUser } from "@/lib/auth";

type Params = Promise<{
  id: string;
}>;

// ========================================
// GET
// جلب خدمات الزبون
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    // ========================================
    // التأكد من وجود الزبون
    // ========================================

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: "Client introuvable",
        },
        { status: 404 }
      );
    }

    // ========================================
    // جلب الخدمات الخاصة بالزبون
    // ========================================

    const servicesClient = await ServicesClient.find({
      client: id,
    })
      .populate(
        "service",
        "name clientPrice employeePrice isRecurring recurrence"
      )
      .populate(
        "paymentMethod",
        "name"
      )
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      services: servicesClient,
    });
  } catch (error) {
    console.error(
      "GET /api/clients/[id]/services error:",
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
// POST
// إضافة / تعديل خدمات الزبون
// ========================================

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();

    // ========================================
    // المستخدم الحالي
    // ========================================

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non autorisé",
        },
        { status: 401 }
      );
    }

    // ========================================
    // التأكد من وجود الزبون
    // ========================================

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: "Client introuvable",
        },
        { status: 404 }
      );
    }

    // ========================================
    // الخدمات المختارة
    // ========================================

    const selectedServices = Array.isArray(
      body.services
    )
      ? body.services
      : [];

    // ========================================
    // لا توجد خدمات
    // ========================================

    if (selectedServices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun service sélectionné",
        },
        { status: 400 }
      );
    }

    const createdServices = [];
    const updatedServices = [];

    // ========================================
    // معالجة كل خدمة
    // ========================================

    for (const serviceId of selectedServices) {
      // ========================================
      // جلب الخدمة
      // ========================================

      const service =
        await Service.findById(serviceId);

      if (!service) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Service introuvable: ${serviceId}`,
          },
          { status: 400 }
        );
      }

      // ========================================
      // التاريخ
      // ========================================

      const assignedDate =
        body.assignedDates?.[serviceId];

      if (!assignedDate) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Veuillez sélectionner une date pour le service "${service.name}"`,
          },
          { status: 400 }
        );
      }

      // ========================================
      // طريقة الدفع
      // ========================================

      const paymentMethodId =
        body.paymentMethods?.[serviceId];

      if (!paymentMethodId) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Veuillez sélectionner un mode de paiement pour le service "${service.name}"`,
          },
          { status: 400 }
        );
      }

      // ========================================
      // التأكد من وجود طريقة الدفع
      // ========================================

      const paymentMethod =
        await PaymentMethod.findById(
          paymentMethodId
        );

      if (!paymentMethod) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Mode de paiement introuvable",
          },
          { status: 400 }
        );
      }

      // ========================================
      // حساب سعر العميل
      // ========================================

      let clientPrice =
        service.clientPrice;

      /*
       * إذا كانت طريقة الدفع CCP
       *
       * الحساب:
       *
       * (clientPrice / 5000) * 12 + 18
       */

      if (
        paymentMethod.name
          ?.toString()
          .trim()
          .toUpperCase() === "CCP"
      ) {
        clientPrice =
          (service.clientPrice / 5000) * 12 + 18;
      }

      // ========================================
      // تحويل التاريخ بدون مشكلة timezone
      // ========================================

      const [
        year,
        month,
        day,
      ] = assignedDate
        .split("-")
        .map(Number);

      const datePayement = new Date(
        Date.UTC(
          year,
          month - 1,
          day
        )
      );

      // ========================================
      // البحث عن الخدمة الموجودة مسبقًا
      // ========================================

      const existingService =
        await ServicesClient.findOne({
          client: id,
          service: serviceId,
        });

      // ========================================
      // الخدمة موجودة مسبقًا
      // ========================================

      if (existingService) {
        // إعادة التفعيل
        existingService.active = true;

        // تحديث التاريخ
        existingService.datePayement =
          datePayement;

        // تحديث طريقة الدفع
        existingService.paymentMethod =
          paymentMethodId;

        // تحديث سعر العميل
        existingService.clientPrice =
          clientPrice;

        // تحديث سعر الموظف
        existingService.employeePrice =
          service.employeePrice;

        await existingService.save();

        updatedServices.push(
          existingService
        );

        continue;
      }

      // ========================================
      // إنشاء خدمة جديدة
      // ========================================

      const newService =
        await ServicesClient.create({
          client: id,

          service: serviceId,

          clientPrice:
            clientPrice,

          employeePrice:
            service.employeePrice,

          createdBy:
            user.id,

          datePayement,

          active: true,

          paymentMethod:
            paymentMethodId,
        });

      createdServices.push(
        newService
      );
    }

    // ========================================
    // النتيجة
    // ========================================

    return NextResponse.json({
      success: true,

      message:
        "Les services ont été enregistrés avec succès",

      createdServices,

      updatedServices,
    });
  } catch (error) {
    console.error(
      "POST /api/clients/[id]/services error:",
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