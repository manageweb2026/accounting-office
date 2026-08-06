import { NextRequest, NextResponse } from "next/server";
import Service from "@/models/Service";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/auth";
type Params = Promise<{
  id: string;
}>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = await params;

  const tasks = await Task.find({
    client: id,
    recurringActive: true,
  }).populate("service");

  return NextResponse.json({
    success: true,
    tasks,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();

    const user = getCurrentUser(request);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Utilisateur non autorisé",
    },
    { status: 401 }
  );
}

    const { services } = body;

    // الخدمات الموجودة حاليا
    const existingTasks = await Task.find({
      client: id,
      recurringActive: true,
    });

    const existingServiceIds = existingTasks.map((task) =>
      task.service.toString()
    );

    // الخدمات الجديدة
    const servicesToCreate = services.filter(
      (serviceId: string) =>
        !existingServiceIds.includes(serviceId)
    );

    // الخدمات المحذوفة
    const servicesToDelete = existingServiceIds.filter(
      (serviceId) =>
        !services.includes(serviceId)
    );

    // حذف الخدمات التي أزيلت
    await Task.deleteMany({
      client: id,
      service: { $in: servicesToDelete },
    });

    // إنشاء الخدمات الجديدة
  for (const serviceId of servicesToCreate) {

  const service = await Service.findById(serviceId);

  if (!service) continue;

  await Task.create({
    client: id,
    service: service._id,

    clientPrice: service.clientPrice,
    employeePrice: service.employeePrice,

   createdBy: user.id,

    dueDate: new Date(),

    status: "nouvelle",

    notes: "",

    isRecurring: service.isRecurring,
    recurrence: service.recurrence,

    recurringActive: true,

    lastExecution: null,
    nextExecution: null,
  });

}

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}