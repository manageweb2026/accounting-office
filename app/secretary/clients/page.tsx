"use client";

import { useEffect, useState } from "react";

import EditClientForm from "@/components/clients/EditClientForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import ClientForm from "@/components/clients/ClientForm";

import {
  Dialog,
  DialogContent,
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
  // ==========================================
  // إضافة / تعديل العميل
  // ==========================================

  const [open, setOpen] = useState(false);

  const [editingClient, setEditingClient] =
    useState<Client | null>(null);

  // ==========================================
  // قائمة العملاء
  // ==========================================

  const [clients, setClients] =
    useState<Client[]>([]);

  // ==========================================
  // خدمات العميل
  // ==========================================

  const [servicesOpen, setServicesOpen] =
    useState(false);

  const [servicesClient, setServicesClient] =
    useState<Client | null>(null);

  // ==========================================
  // تحميل العملاء
  // ==========================================

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await fetch("/api/clients", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des clients:",
        error
      );
    }
  }

  // ==========================================
  // حذف العميل
  // ==========================================

  async function deleteClient(id: string) {
    try {
      const res = await fetch(
        `/api/clients/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(
          data.message ||
            "Erreur lors de la suppression du client"
        );
        return;
      }

      await loadClients();

    } catch (error) {
      console.error(
        "Erreur suppression client:",
        error
      );

      alert(
        "Erreur serveur lors de la suppression"
      );
    }
  }

  return (
    <div className="p-6">

      {/* ======================================
          العنوان + إضافة عميل
      ====================================== */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des clients
        </h1>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);

            if (!value) {
              setEditingClient(null);
            }
          }}
        >

          <DialogTrigger asChild>

            <button
              type="button"
              onClick={() => {
                setEditingClient(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Créer client
            </button>

          </DialogTrigger>

          <DialogContent className="max-w-2xl">

            {editingClient ? (

              <EditClientForm
                client={editingClient}
                onSuccess={() => {
                  setOpen(false);
                  setEditingClient(null);
                  loadClients();
                }}
              />

            ) : (

              <ClientForm
                onSuccess={() => {
                  setOpen(false);
                  loadClients();
                }}
              />

            )}

          </DialogContent>

        </Dialog>

      </div>

      {/* ======================================
          جدول العملاء
      ====================================== */}

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
              Statut
            </th>

            <th className="p-3 border">
              Services
            </th>

            <th className="p-3 border">
              Opérations
            </th>

          </tr>

        </thead>

        <tbody>

          {clients.map((client) => (

            <tr key={client._id}>

              {/* Nom */}

              <td className="border p-3">
                {client.firstName}
              </td>

              {/* Prénom */}

              <td className="border p-3">
                {client.lastName}
              </td>

              {/* Contact */}

              <td className="border p-3">
                {client.contact}
              </td>

              {/* Statut */}

              <td className="border p-3">
                {client.isActive
                  ? "Actif"
                  : "Inactif"}
              </td>

              {/* =================================
                  Services
              ================================= */}

              <td className="border p-3">

                <button
                  type="button"
                  onClick={() => {
                    setServicesClient(client);
                    setServicesOpen(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Services
                </button>

              </td>

              {/* =================================
                  Opérations
              ================================= */}

              <td className="border p-3">

                <div className="flex gap-2">

                  {/* Modifier */}

                  <button
                    type="button"
                    onClick={() => {
                      setEditingClient(client);
                      setOpen(true);
                    }}
                    className="bg-amber-500 text-white px-3 py-1 rounded"
                  >
                    Modifier
                  </button>

                  {/* Supprimer */}

                  <DeleteConfirmation
                    title="Supprimer le client"
                    description="Voulez-vous vraiment supprimer ce client ?"
                    onConfirm={() =>
                      deleteClient(client._id)
                    }
                  >

                    <button
                      type="button"
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>

                  </DeleteConfirmation>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* ======================================
          Dialog Services du client
      ====================================== */}

      {servicesClient && (

        <ClientServicesDialog
          open={servicesOpen}
          onOpenChange={(value) => {
            setServicesOpen(value);

            if (!value) {
              setServicesClient(null);
            }
          }}
          clientId={servicesClient._id}
        />

      )}

    </div>
  );
}