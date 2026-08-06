"use client";

import { useEffect, useState } from "react";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EditEmployeeForm from "@/components/employees/EditEmployeeForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type User = {
  _id: string;
  fullName: string;
  username: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
};

export default function EmployeesPage() {
 
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();

    if (data.success) {
      setUsers(data.users);
    }
  }

   async function deleteUsers(id: string) {
 

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadUsers();

  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء الحذف");
  }
}
  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gestion des employes
        </h1>

       <Dialog open={open} onOpenChange={setOpen}>

  <DialogTrigger asChild>

    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      creer employee
    </button>

  </DialogTrigger>

  <DialogContent className="max-w-2xl">

    <DialogHeader>

    <DialogTitle>
  {selectedUser ? "تعديل الموظف" : "إضافة موظف جديد"}
</DialogTitle>

    </DialogHeader>

 {selectedUser ? (
  <EditEmployeeForm
    user={selectedUser}
    onSuccess={() => {
      setOpen(false);
      setSelectedUser(null);
      loadUsers();
    }}
  />
) : (
  <EmployeeForm
    onSuccess={() => {
      setOpen(false);
      loadUsers();
    }}
  />
)}
  </DialogContent>

</Dialog>
      </div>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 border">nom</th>

            <th className="p-3 border">prenom</th>

            <th className="p-3 border">role</th>

            <th className="p-3 border">tel</th>

            <th className="p-3 border">status</th>

            <th className="p-3 border">operations</th>
            

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id}>

              <td className="border p-3">{user.fullName}</td>

              <td className="border p-3">{user.username}</td>

              <td className="border p-3">{user.role}</td>

              <td className="border p-3">{user.phone}</td>

              <td className="border p-3">

                {user.isActive ? "نشط" : "موقوف"}

              </td>

             <td className="border p-3">
  <div className="flex gap-2">
    <button
      onClick={() => {
        setSelectedUser(user);
        setOpen(true);
      }}
      className="bg-amber-500 text-white px-3 py-1 rounded"
    >
      modifier
    </button>

   <DeleteConfirmation
  title="Supprimer le service"
  description="Voulez-vous vraiment supprimer ce service ?"
  onConfirm={() => deleteUsers(user._id)}
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