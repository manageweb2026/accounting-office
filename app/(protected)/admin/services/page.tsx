"use client";

import { useEffect, useState } from "react";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import ServiceForm from "@/components/services/ServiceForm";
import EditServiceForm from "@/components/services/EditServiceForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


type Service = {
  _id: string;
  name: string;
  description: string;
  clientPrice: number;
  employeePrice: number;

  
  isRecurring: boolean;
  recurrence: string;
  isActive: boolean;
};

export default function ServicesPage() {
  
  const [open, setOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([]);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const res = await fetch("/api/services");
    const data = await res.json();
      console.log(data.services);


    if (data.success) {
      setServices(data.services);
    }
  }

 async function deleteService(id: string) {
  console.log("Deleting:", id);

  try {
  

const res = await fetch(`/api/services/${id}`, {
  method: "DELETE",
});
   

    const data = await res.json();

    console.log(data);

    if (!data.success) {
      alert(data.message);
      return;
    }

   await loadServices();

  } catch (error) {
    console.error(error);
  }
}
  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des services
        </h1>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >

          <DialogTrigger asChild>

            <button
              onClick={() =>
                setSelectedService(null)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Ajouter un service
            </button>

          </DialogTrigger>

          <DialogContent className="max-w-xl">

            <DialogHeader>

              <DialogTitle>

                {selectedService
                  ? "Modifier le service"
                  : "Ajouter un service"}

              </DialogTitle>

            </DialogHeader>

            {selectedService ? (

              <EditServiceForm
                service={selectedService}
               onSuccess={async () => {
  setOpen(false);
  setSelectedService(null);
  await loadServices();
}}
              />

            ) : (

              <ServiceForm
                onSuccess={() => {
                  setOpen(false);
                  loadServices();
                }}
              />

            )}

          </DialogContent>

        </Dialog>

      </div>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-3">
              nom de service
            </th>

            <th className="border p-3">
              description
            </th>

            <th className="border p-3">
              Prix Client (DA)
            </th>

            <th className="border p-3">
              Prix Employé (DA)
            </th>

            <th className="border p-3">
              status
            </th>

             <th className="border p-3">
               Récurrence
            </th>

            <th className="border p-3">
              operation
            </th>

          </tr>

        </thead>

        <tbody>

          {services.map((service) => (

            <tr key={service._id}>

              <td className="border p-3">
                {service.name}
              </td>

              <td className="border p-3">
                {service.description}
              </td>

              <td className="border p-3">
                {service.clientPrice} 
              </td>

              <td className="border p-3">
                {service.employeePrice} 
              </td>

              <td className="border p-3">
                <span
  className={`px-2 py-1 rounded text-white text-sm ${
    service.isActive
      ? "bg-green-600"
      : "bg-red-600"
  }`}
>
  {service.isActive ? "Active" : "Inactive"}
</span>
              </td>

               <td className="border p-3 text-center">

  {service.isRecurring ? (

    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

      {service.recurrence === "mensuel" && "Mensuel"}

      {service.recurrence === "trimestriel" && "Trimestriel"}

      {service.recurrence === "semestriel" && "Semestriel"}

      {service.recurrence === "annuel" && "Annuel"}

    </span>

  ) : (

    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
      Ponctuel
    </span>

  )}

</td>

              <td className="border p-3">

               <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setOpen(true);
                    }}
                    className="bg-amber-500 text-white px-3 py-1 rounded"
                  >
                    Modifier
                  </button>

                <DeleteConfirmation
  title="Supprimer le service"
  description="Voulez-vous vraiment supprimer ce service ?"
  onConfirm={() => deleteService(service._id)}
>
  <button className="bg-red-600 text-white px-3 py-1 rounded">
    Supprimer
  </button>
</DeleteConfirmation>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}