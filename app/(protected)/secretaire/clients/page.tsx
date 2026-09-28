"use client";

import { useEffect, useState } from "react";
import ClientForm from "@/components/clients/ClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientServicesDialog from "@/components/clients/ClientServicesDialog";

type Client = {
  _id: string;
  firstName: string;
  lastName: string;
  contact: string;
  address: string;
  nif: string;
  nis: string;
  na: string;
  rc: string;
  isActive: boolean;
};

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [servicesClient, setServicesClient] =
    useState<Client | null>(null);

  async function loadClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();

    if (data.success) {
      setClients(data.clients);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div className="p-6">

      {/* العنوان وزر إضافة الزبون */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des clients
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Créer client
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Ajouter un client
              </DialogTitle>
            </DialogHeader>

            <ClientForm
              onSuccess={() => {
                setOpen(false);
                loadClients();
              }}
            />
          </DialogContent>

        </Dialog>

      </div>

      {/* جدول الزبائن */}
      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">
              Nom
            </th>

            <th className="p-3 border">
              Prénom
            </th>

            <th className="p-3 border">
              Contact
            </th>

            <th className="p-3 border">
              Status
            </th>

            <th className="p-3 border">
              Services
            </th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>

              <td className="border p-3">
                {client.firstName}
              </td>

              <td className="border p-3">
                {client.lastName}
              </td>

              <td className="border p-3">
                {client.contact}
              </td>

              <td className="border p-3">
                {client.isActive ? "Actif" : "Inactif"}
              </td>

              <td className="border p-3">

                <button
                  onClick={() => {
                    setServicesClient(client);
                    setServicesOpen(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Recurrent
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {/* خدمات العميل */}
      {servicesClient && (
        <ClientServicesDialog
          open={servicesOpen}
          onOpenChange={setServicesOpen}
          clientId={servicesClient._id}
        />
      )}

    </div>
  );
}