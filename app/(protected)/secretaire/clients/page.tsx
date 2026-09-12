"use client";

import { useEffect, useState } from "react";
import EditClientForm from "@/components/clients/EditClientForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import ClientForm from "@/components/clients/ClientForm";
import AssignServicesDialog from "@/components/clients/AssignServicesDialog";
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
const [openServices, setOpenServices] = useState(false);


const [servicesOpen, setServicesOpen] = useState(false);

const [servicesClient, setServicesClient] =
  useState<Client | null>(null);

const [editingClient, setEditingClient] =
  useState<Client | null>(null);
  useEffect(() => {
    loadClients();
    
  }, []);



  async function loadClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();

    if (data.success) {
      setClients(data.clients);
    }
  }

  async function deleteClient(id: string) {


  try {
    const res = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadClients();

  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء الحذف");
  }
}

  return (
    <div className="p-6">

      {/* العنوان وزر الإضافة */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des clients
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>

         <DialogTrigger asChild>
  <button
    onClick={() => setSelectedClient(null)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    creer client
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

      {/* جدول الزبائن */}

      <table className="w-full border">

   <thead className="bg-gray-100">
  <tr>
    <th className="p-3 border">nom</th>
    <th className="p-3 border">prenom</th>
    <th className="p-3 border">contact</th>
 
    <th className="p-3 border">status</th>
    
      <th className="p-3 border">
  Services
</th>
    <th className="p-3 border">operation</th>
  </tr>
</thead>

<tbody>
  {clients.map((client) => (
    <tr key={client._id}>
      <td className="border p-3">{client.firstName}</td>

      <td className="border p-3">{client.lastName}</td>

      <td className="border p-3">{client.contact}</td>

    

      <td className="border p-3">
        {client.isActive ? "Actif" : "Inactif"}
      </td>
      <td className="border p-3">

 
{/* المهام الدورية */}
<button
  onClick={() => {
    setServicesClient(client);
    setServicesOpen(true);
  }}
  className="bg-blue-600 text-white px-3 py-1 rounded"
>
  Recurrent
</button>

{/* المهام العادية */}
<button
  onClick={() => {
    setTaskClient(client);
    setTaskOpen(true);
  }}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Tasks
</button>
</td>


      <td className="border p-3">
        <div className="flex gap-2">
         <button
  onClick={() => {
  setEditingClient(client);
  setOpen(true);
}}
  className="bg-amber-500 text-white px-3 py-1 rounded"
>
  modifier
</button>

       <DeleteConfirmation
  title="Supprimer le service"
  description="Voulez-vous vraiment supprimer ce service ?"
  onConfirm={() => deleteClient(client._id)}
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