"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Service = {
  _id: string;
  name: string;
  clientPrice: number;
  employeePrice: number;
  isRecurring: boolean;
  recurrence?: string;
};

type Props = {
  client: any;
  onSuccess?: () => void;
};

export default function AssignServicesDialog({
  client,
  onSuccess,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const res = await fetch("/api/services");
    const data = await res.json();

    if (data.success) {
      setServices(data.services);
    }
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }

  async function saveServices() {

  if (selectedServices.length === 0) {
    toast.error("Choisissez au moins un service");
    return;
  }

  const servicesToCreate = services.filter((service) =>
    selectedServices.includes(service._id)
  );

  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: client._id,
      dueDate: new Date(),
      notes: "",

      services: servicesToCreate,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    toast.error("Erreur");
    return;
  }

  toast.success("Les tâches ont été créées");

  onSuccess?.();
}
  return (
    <div className="space-y-6">

      <div className="border rounded-lg p-4 bg-gray-50">

        <h2 className="text-xl font-bold">
          {client.firstName} {client.lastName}
        </h2>

        <p className="text-gray-500">
          Choisissez les services demandés
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4">

        {services.map((service) => {

          const selected = selectedServices.includes(service._id);

          return (
            <div
              key={service._id}
              onClick={() => toggleService(service._id)}
              className={`
                cursor-pointer
                rounded-lg
                border
                p-4
                transition

                ${
                  selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }
              `}
            >
              <div className="font-bold">
                {service.name}
              </div>

              <div className="text-sm text-gray-500">
                {service.clientPrice} DA
              </div>

              <div className="text-sm">

                {service.isRecurring
                  ? service.recurrence
                  : "Ponctuel"}

              </div>

            </div>
          );
        })}

      </div>

      <div className="flex justify-end">

        <Button onClick={saveServices}>
          Enregistrer
        </Button>

      </div>

    </div>
  );
}