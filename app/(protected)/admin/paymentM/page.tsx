"use client";

import { useEffect, useState } from "react";

type PaymentMethod = {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // جلب طرق الدفع
  async function loadPaymentMethods() {
    try {
      const res = await fetch("/api/payment-methods");
      const data = await res.json();

      if (data.success) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء جلب طرق الدفع");
    }
  }

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // إضافة أو تعديل
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("يرجى إدخال اسم طريقة الدفع");
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `/api/payment-methods/${editingId}`
        : "/api/payment-methods";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isActive,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      // تنظيف الفورم
      setName("");
      setIsActive(true);
      setEditingId(null);

      // تحديث القائمة
      loadPaymentMethods();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حفظ طريقة الدفع");
    } finally {
      setLoading(false);
    }
  }

  // تجهيز التعديل
  function handleEdit(paymentMethod: PaymentMethod) {
    setEditingId(paymentMethod._id);
    setName(paymentMethod.name);
    setIsActive(paymentMethod.isActive);
  }

  // حذف
  async function handleDelete(id: string) {
    const confirmed = confirm(
      "Voulez-vous vraiment supprimer ce mode de paiement ?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      loadPaymentMethods();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حذف طريقة الدفع");
    }
  }

  // إلغاء التعديل
  function cancelEdit() {
    setEditingId(null);
    setName("");
    setIsActive(true);
  }

  return (
    <div className="p-6">
      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Gestion des modes de paiement
        </h1>

        <p className="text-gray-500 mt-2">
          Ajouter, modifier et gérer les modes de paiement.
        </p>
      </div>

   {/* Formulaire */}
<div className="border rounded-lg p-5 mb-8 bg-white shadow-sm max-w-3xl">
  <h2 className="text-xl font-semibold mb-4">
    {editingId
      ? "Modifier le mode de paiement"
      : "Ajouter un mode de paiement"}
  </h2>

  <form onSubmit={handleSubmit}>
    <div className="flex gap-4 items-end">
      {/* الاسم */}
      <div className="flex-1">
        <label className="block mb-2 font-medium">
          Nom du mode de paiement
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Espèces"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* الحالة */}
      <div>
        <label className="block mb-2 font-medium">
          Statut
        </label>

        <select
          value={isActive ? "active" : "inactive"}
          onChange={(e) =>
            setIsActive(e.target.value === "active")
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      {/* زر */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
        
                {loading
                  ? "Enregistrement..."
                  : editingId
                  ? "Modifier"
                  : "Ajouter"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border px-5 py-2 rounded-lg"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* جدول */}
      <div className="border rounded-lg overflow-hidden max-w-3xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">
                Mode de paiement
              </th>

              <th className="border p-3 text-left">
                Statut
              </th>

            

              <th className="border p-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paymentMethods.length === 0? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-6 text-gray-500"
                >
                  Aucun mode de paiement
                </td>
              </tr>
            ) : (
              paymentMethods.map((paymentMethod) => (
                <tr key={paymentMethod._id}>
                  <td className="border p-3">
                    {paymentMethod.name}
                  </td>

                  <td className="border p-3">
                    {paymentMethod.isActive ? (
                      <span className="text-green-600 font-medium">
                        Actif
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Inactif
                      </span>
                    )}
                  </td>

                
                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleEdit(paymentMethod)
                        }
                        className="bg-amber-500 text-white px-3 py-1 rounded"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(paymentMethod._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}