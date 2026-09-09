import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Client from "@/models/Client";
import Service from "@/models/Service";
console.log(Client);
console.log(Service);
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    console.log("Cookies:", request.cookies.getAll());

    console.log("Cookies:", request.cookies.getAll());

const token = request.cookies.get("token")?.value;

console.log("TOKEN:", token);

const user = await getCurrentUser(request);
console.log("User:", user);

  
const allTasks = await Task.find();

console.log(
  allTasks.map((t) => ({
    id: t._id.toString(),
    employee: t.employee?.toString(),
    status: t.status,
  }))
);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Utilisateur non autorisé",
      });
    }
console.log("Client Model:", Client.modelName);
console.log("Service Model:", Service.modelName);
console.log("Task Model:", Task.modelName);


 const tasks = await Task.find({
  employee: user.id,
  status: "en_cours",
})
.populate(
  "client",
  "firstName lastName nif nis na rc"
)
.populate("service", "name")
.sort({ assignedAt: -1 });
  
    return NextResponse.json({
      success: true,
      tasks,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Erreur serveur",
    });

  }
}