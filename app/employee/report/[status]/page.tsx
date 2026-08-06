"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Task = {
  _id: string;
  client: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
  };
  employeePrice: number;
  dueDate: string;
  status: string;
};

export default function TasksByStatusPage() {

 

  const params = useParams();
  const router = useRouter();

  const status = params.status as string;

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, [status]);

  async function loadTasks() {
    const res = await fetch(`/api/employee/report/${status}`, {
      credentials: "include",
       cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      setTasks(data.tasks);
    }
  }

  function getTitle() {
    switch (status) {
      case "nouvelle":
        return "Nouvelles tâches";

      case "en_cours":
        return "Tâches en cours";

      case "terminee":
        return "Tâches terminées";

      default:
        return "Tâches";
    }
  }

  return (
    
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          {getTitle()}
        </h1>

       

         <Button
  variant="outline"
  className="mb-6"
  onClick={() => router.back()}
>
  ← Retour
</Button>

      </div>

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
              Prix
            </th>

            <th className="border p-3">
              Date limite
            </th>

            <th className="border p-3">
              Statut
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
                {task.employeePrice} DA
              </td>

              <td className="border p-3">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>

              <td className="border p-3">
                {task.status}
              </td>

            </tr>

          ))}

          {tasks.length === 0 && (

            <tr>

              <td
                colSpan={5}
                className="text-center p-6 text-gray-500"
              >
                Aucune tâche trouvée.
              </td>

            </tr>
            

          )}

        </tbody>

      </table>

    </div>
  );
}