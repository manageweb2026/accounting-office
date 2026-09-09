"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ReportData {
  employee: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };

  summary: {
    newTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    profit: number;
  };

  tasks: any[];
}

export default function EmployeeReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { id } = await params;

      const res = await fetch(`/api/users/reports/${id}`, {
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        setData(result);
      }

      setLoading(false);
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Chargement...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        Employé introuvable.
      </div>
    );
  }
  const handleDetails = (task: any) => {
  setSelectedTask(task);
  setOpen(true);
};

  return (
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          {data.employee.fullName}
        </h1>

        <p className="text-gray-600 mt-2">
          Téléphone : {data.employee.phone || "-"}
        </p>

        <p className="text-gray-600">
          Email : {data.employee.email || "-"}
        </p>

        <p className="text-gray-600">
          Adresse : {data.employee.address || "-"}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">

        <div className="border rounded-lg p-5 shadow-sm">
          <p className="text-gray-500">Nouvelles Taches</p>

          <h2 className="text-3xl font-bold">
            {data.summary.newTasks}
          </h2>
        </div>

        <div className="border rounded-lg p-5 shadow-sm">
          <p className="text-gray-500">Taches en cours</p>

          <h2 className="text-3xl font-bold">
            {data.summary.inProgressTasks}
          </h2>
        </div>

        <div className="border rounded-lg p-5 shadow-sm">
          <p className="text-gray-500">Taches complétées</p>

          <h2 className="text-3xl font-bold">
            {data.summary.completedTasks}
          </h2>
        </div>

        <div className="border rounded-lg p-5 shadow-sm">
          <p className="text-gray-500">Prix_total</p>

          <h2 className="text-3xl font-bold">
            {data.summary.profit} DA
          </h2>
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-3">Client</th>

              <th className="border p-3">Service</th>

              <th className="border p-3">Status</th>

              <th className="border p-3">Due Date</th>

                <th className="border p-3">Prix_employee</th>

              <th className="border p-3">Prix_client</th>

              

             <th className="border p-3">details</th>

            </tr>

          </thead>

          <tbody>

            {data.tasks.map((task) => (

              <tr key={task._id}>

                <td className="border p-3">
                  {task.client.firstName} {task.client.lastName}
                </td>

                <td className="border p-3">
                  {task.service.name}
                </td>

                <td className="border p-3">
                  {task.status}
                </td>

                <td className="border p-3">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>

                <td className="border p-3">
                  {task.employeePrice} DA
                </td>

                 <td className="border p-3">
                  {task.clientPrice} DA
                </td>

                

              <Button
    onClick={() => handleDetails(task)}
>
    Details
</Button>

              </tr>

            ))}
            

          </tbody>

        </table>


       <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

    {selectedTask && (
      <div
        id="print-area"
        className="bg-white rounded-lg border p-10 space-y-8"
      >
        {/* En-tête */}
        <div className="text-center border-b pb-6">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Informations de la tâche
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Cabinet Comptable
          </p>
        </div>

        {/* Informations du client */}
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-5">
            Informations du client
          </h2>

          <div className="grid grid-cols-2 gap-y-4 gap-x-12">

            <span className="font-semibold">
              Nom
            </span>

            <span>
              {selectedTask.client.firstName} {selectedTask.client.lastName}
            </span>

            <span className="font-semibold">
              Téléphone
            </span>

            <span>
              {selectedTask.client.contact || "-"}
            </span>

            <span className="font-semibold">
              Adresse
            </span>

            <span>
              {selectedTask.client.address || "-"}
            </span>

          </div>
        </section>

        {/* Service */}
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-5">
            Informations du service
          </h2>

          <div className="grid grid-cols-2 gap-y-4 gap-x-12">

            <span className="font-semibold">
              Service
            </span>

            <span>
              {selectedTask.service.name}
            </span>

            <span className="font-semibold">
              Prix du client
            </span>

            <span>
              {selectedTask.clientPrice} DA
            </span>

           
          </div>
        </section>

        {/* Tâche */}
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-5">
            Informations de la tâche
          </h2>

          <div className="grid grid-cols-2 gap-y-4 gap-x-12">

            <span className="font-semibold">
              Statut
            </span>

            <span>
              {selectedTask.status}
            </span>

            <span className="font-semibold">
              Date limite
            </span>

            <span>
              {new Date(selectedTask.dueDate).toLocaleDateString("fr-FR")}
            </span>

            <span className="font-semibold">
              Remarques
            </span>

            <span>
              {selectedTask.notes || "-"}
            </span>

          </div>
        </section>

        {/* Boutons */}
        <div className="flex justify-end gap-4 pt-6 print:hidden">

          <Button onClick={() => window.print()}>
            Imprimer
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>

        </div>

      </div>
    )}

  </DialogContent>
</Dialog>

      </div>

    </div>
  );
}