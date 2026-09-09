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

  dueDate: string;
  status: string;
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  console.log("Tasks:", tasks);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const res = await fetch("/api/employee/my_tasks");fetch("/api/employee/my_tasks", {
  credentials: "include",
})
    const data = await res.json();

    if (data.success) {
      setTasks(data.tasks);
    }
  }

 

  async function terminerTask(id: string) {
  const res = await fetch(`/api/employee/tasks/${id}/complete`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();

  if (data.success) {
    alert("تم إنهاء المهمة");
    window.location.reload();
  }
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Mes tâches
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
              Statut
            </th>

            <th className="border p-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>

          {tasks.map((task) => (

            <tr key={task._id}>

              <td className="border p-3">
              {task.client?.firstName} {task.client?.lastName}
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

              <td className="border p-3">
                {task.service?.name}
              </td>

           {/* Date de travail */}
      <td className="border p-3">
        {task.assignedAt
          ? new Date(task.assignedAt).toLocaleDateString("fr-FR")
          : "-"}
</td>

              <td className="border p-3">

                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  En cours
                </span>

              </td>

              <td className="border p-3">

          

 

 <button
  onClick={() => terminerTask(task._id)}
  style={{
    backgroundColor: "green",
    color: "white",
    padding: "8px",
    borderRadius: "5px",
  }}
>
  Terminer
</button>
</td>

         

            </tr>

          ))}

          {tasks.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center p-6 text-gray-500"
              >
                Aucune tâche en cours.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}