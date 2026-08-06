"use client";

import { useEffect, useState } from "react";

import TaskForm from "@/components/tasks/TaskForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Task = {
  _id: string;

  client: {
    firstName: string;
    lastName: string;
  };

  service: {
    name: string;
  };

  clientPrice: number;
  employeePrice:number;

  status: string;

  dueDate: string;
};

export default function TasksPage() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {

    const res = await fetch("/api/tasks");

    const data = await res.json();

    if (data.success) {
      setTasks(data.tasks);
    }

  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des tâches
        </h1>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >

          <DialogTrigger asChild>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">

              Nouvelle tâche

            </button>

          </DialogTrigger>

          <DialogContent className="max-w-2xl">

            <DialogHeader>

              <DialogTitle>

                Nouvelle tâche

              </DialogTitle>

            </DialogHeader>

            <TaskForm
              onSuccess={() => {
                setOpen(false);
                loadTasks();
              }}
            />

          </DialogContent>

        </Dialog>

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

                {task.clientPrice} DA

              </td>

              <td className="border p-3">

                {new Date(task.dueDate).toLocaleDateString()}

              </td>

              <td className="border p-3">

                {task.status}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}