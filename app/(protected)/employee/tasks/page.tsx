"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;

  client: {
    firstName: string;
    lastName: string;
    nif:string;
    nis:string;
    na:string;
    rc:string;
  }| null;

  service: {
    name: string;
  }| null;

  assignedAt: string | null;
};

export default function EmployeePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const res = await fetch("/api/employee/tasks");

    const data = await res.json();

    if (data.success) {
      setTasks(data.tasks);
    }
  }

  async function takeTask(id: string) {

  const res = await fetch(
    `/api/employee/tasks/${id}/take`,
    {
      method: "PUT",
      
    }
  );

  const data = await res.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  loadTasks();
  
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Nouvelles tâches
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-3">
              Client
            </th>

            <th className="border p-3">
              Nif
            </th>


            <th className="border p-3">
              Nis
            </th>


            <th className="border p-3">
              Na
            </th>

              <th className="border p-3">
              Rc
            </th>



            <th className="border p-3">
              Service
            </th>

            <th className="border p-3">
              Date de travail
            </th>

            <th className="border p-3">
              Action
            </th>

          </tr>

        </thead>

       <tbody>
  {tasks.map((task) => (
    <tr key={task._id}>

      {/* Client */}
      <td className="border p-3">
        {task.client
          ? `${task.client.firstName} ${task.client.lastName}`
          : "Client supprimé"}
      </td>

      {/* NIF */}
      <td className="border p-3">
        {task.client?.nif || "-"}
      </td>

      {/* NIS */}
      <td className="border p-3">
        {task.client?.nis || "-"}
      </td>

      {/* NA */}
      <td className="border p-3">
        {task.client?.na || "-"}
      </td>

      {/* RC */}
      <td className="border p-3">
        {task.client?.rc || "-"}
      </td>

      {/* Service */}
      <td className="border p-3">
        {task.service
          ? task.service.name
          : "Service supprimé"}
      </td>

      {/* Date de travail */}
      <td className="border p-3">
        {task.assignedAt
          ? new Date(task.assignedAt).toLocaleDateString("fr-FR")
          : "-"}
      </td>

      {/* Action */}
      <td className="border p-3">
        <button
          onClick={() => takeTask(task._id)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Prendre
        </button>
      </td>

    </tr>
  ))}
</tbody>

      </table>

    </div>
  );
}