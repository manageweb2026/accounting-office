"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  taskSchema,
  TaskFormData,
} from "@/lib/validations/task";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

type Client = {
  _id: string;
  firstName: string;
  lastName: string;
};

type Service = {
  _id: string;
  name: string;
  clientPrice: number;
  employeePrice: number;

    isRecurring: boolean;
  recurrence: string | null;
};

type TaskFormProps = {
  onSuccess?: () => void;
};

export default function TaskForm({
  onSuccess,
}: TaskFormProps) {
    const [clients, setClients] = useState<Client[]>([]);

const [services, setServices] = useState<Service[]>([]);

const [selectedServices, setSelectedServices] = useState<string[]>([]);

const [selectedPrice, setSelectedPrice] =
  useState(0);


  const form = useForm<TaskFormData>({
  resolver: zodResolver(taskSchema),

  defaultValues: {
    client: "",
    service: "",
    dueDate: "",
    notes: "",
  },
});

const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = form;

useEffect(() => {
  loadClients();
  loadServices();
}, []);


async function loadClients() {
  const res = await fetch("/api/clients");
  const data = await res.json();

  if (data.success) {
    setClients(data.clients);
  }
}

async function loadServices() {
  const res = await fetch("/api/services");
  const data = await res.json();

  if (data.success) {
    setServices(data.services);
  }

}

function toggleService(id: string) {
  setSelectedServices((prev) => {
    if (prev.includes(id)) {
      return prev.filter((s) => s !== id);
    }

    return [...prev, id];
  });
}

useEffect(() => {
  const serviceId = watch("service");

  const service = services.find(
    (s) => s._id === serviceId
  );

  if (service) {
    setSelectedPrice(service.clientPrice);
  } else {
    setSelectedPrice(0);
  }

}, [watch("service"), services]);

async function onSubmit(data: TaskFormData) {
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  ...data,
  clientPrice: selectedPrice,
  employeePrice: services.find(
    (s) => s._id === data.service
  )?.employeePrice,
}),
    });

    const result = await res.json();

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("La tâche a été créée avec succès");

    form.reset({
      client: "",
      service: "",
      dueDate: "",
      notes: "",
    });

    setSelectedPrice(0);

    onSuccess?.();

  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue");
  }
}

return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-5"
  >
    {/* Client */}

    <div>

      <label className="block mb-2 font-medium">
        Client
      </label>

      <select
        {...register("client")}
        className="w-full border rounded-md p-2"
      >

        <option value="">
          Sélectionner un client
        </option>

        {clients.map((client) => (

          <option
            key={client._id}
            value={client._id}
          >
            {client.firstName} {client.lastName}
          </option>

        ))}

      </select>

      {errors.client && (
        <p className="text-red-500 text-sm mt-1">
          {errors.client.message}
        </p>
      )}

    </div>

    {/* Service */}

    <div>

      <label className="block mb-2 font-medium">
        Service
      </label>

      <select
        {...register("service")}
        className="w-full border rounded-md p-2"
      >

        <option value="">
          Sélectionner un service
        </option>

        {services.map((service) => (

          <option
            key={service._id}
            value={service._id}
          >
            {service.name}
          </option>

        ))}

      </select>

      {errors.service && (
        <p className="text-red-500 text-sm mt-1">
          {errors.service.message}
        </p>
      )}

    </div>

    {/* Prix Client */}

    <div>

      <label className="block mb-2 font-medium">
        Prix Client
      </label>

      <Input
        value={`${selectedPrice} DA`}
        readOnly
      />

    </div>

    <div className="space-y-3">

  <label className="font-medium">
    Services demandés
  </label>

  <div className="grid grid-cols-2 gap-3">

    {services.map((service) => {

      const selected = selectedServices.includes(service._id);

      return (

        <div
          key={service._id}
          onClick={() => toggleService(service._id)}
          className={`
            border rounded-lg p-3 cursor-pointer transition

            ${
              selected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }
          `}
        >

          <div className="font-semibold">
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

</div>

    {/* Date */}

    <div>

      <label className="block mb-2 font-medium">
        Date limite
      </label>

      <Input
        type="date"
        {...register("dueDate")}
      />

      {errors.dueDate && (
        <p className="text-red-500 text-sm mt-1">
          {errors.dueDate.message}
        </p>
      )}

    </div>

    {/* Notes */}

    <div>

      <label className="block mb-2 font-medium">
        Notes
      </label>

      <textarea
        {...register("notes")}
        className="w-full border rounded-md p-2"
        rows={4}
      />

    </div>

    <div className="flex justify-end">

      <Button type="submit">
        Créer la tâche
      </Button>

    </div>

  </form>
);
}