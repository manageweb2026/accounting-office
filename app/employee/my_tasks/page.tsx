"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  client: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
  };
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
              Service
            </th>

            <th className="border p-3">
              Date limite
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

              <td className="border p-3">
                {task.service?.name}
              </td>

              <td className="border p-3">
  {task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
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