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
              Service
            </th>

            <th className="border p-3">
              Date limite
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
                {task.client.firstName} {task.client.lastName}
              </td>

              <td className="border p-3">
                {task.service.name}
              </td>

              <td className="border p-3">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>

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