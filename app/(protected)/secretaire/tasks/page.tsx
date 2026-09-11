"use client";

import { useEffect, useState } from "react";

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
  } | null;

  service: {
    name: string;
  } | null;

  employee: {
    _id: string;
    firstName: string;
    lastName: string;
  } | null;

  clientPrice: number;
  employeePrice: number;

  status: string;

  dueDate: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [open, setOpen] = useState(false);

  // Section affichée par le secrétaire
  const [activeSection, setActiveSection] = useState<
    "nouvelle" | "en_cours" | "terminee" | "annulee"
  >("nouvelle");

  // Mois sélectionné pour les services terminés
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  // Année sélectionnée
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // ==========================================
  // Chargement des tâches
  // ==========================================

  useEffect(() => {
    loadTasks();
  }, []);

  // ==========================================
  // Modification de la tâche
  // ==========================================

  function handleEdit(task: Task) {
    console.log("Modification de la tâche :", task);
  }

  // ==========================================
  // Annulation de la tâche
  // ==========================================

  function handleCancel(taskId: string) {
    setSelectedTaskId(taskId);
    setConfirmOpen(true);
  }

  async function confirmCancel() {
    if (!selectedTaskId) return;

    try {
      console.log("DELETE task:", selectedTaskId);

      const res = await fetch(`/api/tasks/${selectedTaskId}`, {
        method: "DELETE",
      });

      console.log("DELETE status:", res.status);

      const data = await res.json();

      console.log("DELETE response:", data);

      if (!res.ok || !data.success) {
        alert(data.message || "Erreur lors de l'annulation");
        return;
      }

      setConfirmOpen(false);
      setSelectedTaskId(null);

      await loadTasks();

      // Après annulation, afficher directement l'onglet Annulées
      setActiveSection("annulee");
    } catch (error) {
      console.error("Erreur DELETE:", error);
      alert("Erreur serveur");
    }
  }

  // ==========================================
  // Réactivation de la tâche annulée
  // ==========================================

  async function handleReactivate(taskId: string) {
    try {
      console.log("🔄 Réactivation:", taskId);

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reactivate: true,
        }),
      });

      console.log("🔄 Status:", res.status);

      const data = await res.json();

      console.log("🔄 Response:", data);

      if (!res.ok || !data.success) {
        alert(data.message || "Erreur lors de la réactivation");
        return;
      }

      alert("Tâche réactivée avec succès");

      await loadTasks();

      // Après réactivation, retourner à l'onglet Nouvelles
      setActiveSection("nouvelle");
    } catch (error) {
      console.error("❌ Erreur réactivation:", error);
      alert("Erreur serveur");
    }
  }

  // ==========================================
  // Charger les tâches
  // ==========================================

  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks");

      const data = await res.json();

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
    }
  }

  // ==========================================
  // Tâches à afficher selon la section
  // ==========================================

  const filteredTasks = tasks.filter((task) => {
    // Nouvelles
    if (activeSection === "nouvelle") {
      return task.status === "nouvelle" && !task.employee;
    }

    // En cours
    if (activeSection === "en_cours") {
      return (
        task.status === "en_cours" ||
        (task.employee &&
          task.status !== "terminee" &&
          task.status !== "annulee")
      );
    }

    // Terminées
    if (activeSection === "terminee") {
  return task.status === "terminee";
}

    // Annulées
    if (activeSection === "annulee") {
      return task.status === "annulee";
    }

    return false;
  });

  // ==========================================
  // Compteurs
  // ==========================================

  const newTasksCount = tasks.filter(
    (task) => task.status === "nouvelle" && !task.employee
  ).length;

  const inProgressTasksCount = tasks.filter(
    (task) =>
      task.status === "en_cours" ||
      (task.employee &&
        task.status !== "terminee" &&
        task.status !== "annulee")
  ).length;

  const completedTasksCount = tasks.filter(
    (task) => task.status === "terminee"
  ).length;

  const cancelledTasksCount = tasks.filter(
    (task) => task.status === "annulee"
  ).length;

  return (
    <div className="p-6">
      {/* ======================================
          Titre
      ====================================== */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gestion des tâches
        </h1>

        {/* ====================================
            Dialog création tâche
        ==================================== */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* Bouton de création à ajouter plus tard */}
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Nouvelle tâche
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* ======================================
          Dialog confirmation annulation
      ====================================== */}

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Annuler la tâche
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">
              Voulez-vous vraiment annuler cette tâche ?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={() => {
                setConfirmOpen(false);
                setSelectedTaskId(null);
              }}
            >
              Non
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={confirmCancel}
            >
              Oui, annuler
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================================
          Sections des tâches
      ====================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Nouvelles */}
        <button
          type="button"
          onClick={() => setActiveSection("nouvelle")}
          className={`p-4 rounded-lg border text-center transition ${
            activeSection === "nouvelle"
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">
            🆕 Nouvelles
          </div>

          <div className="text-2xl font-bold mt-1">
            {newTasksCount}
          </div>
        </button>

        {/* En cours */}
        <button
          type="button"
          onClick={() => setActiveSection("en_cours")}
          className={`p-4 rounded-lg border text-center transition ${
            activeSection === "en_cours"
              ? "bg-orange-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">
            🔄 En cours
          </div>

          <div className="text-2xl font-bold mt-1">
            {inProgressTasksCount}
          </div>
        </button>

        {/* Terminées */}
        <button
          type="button"
          onClick={() => setActiveSection("terminee")}
          className={`p-4 rounded-lg border text-center transition ${
            activeSection === "terminee"
              ? "bg-green-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">
            ✅ Terminées
          </div>

          <div className="text-2xl font-bold mt-1">
            {completedTasksCount}
          </div>
        </button>

        {/* Annulées */}
        <button
          type="button"
          onClick={() => setActiveSection("annulee")}
          className={`p-4 rounded-lg border text-center transition ${
            activeSection === "annulee"
              ? "bg-red-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">
            ❌ Annulées
          </div>

          <div className="text-2xl font-bold mt-1">
            {cancelledTasksCount}
          </div>
        </button>
      </div>

      {/* ======================================
          Filtres mois / année pour terminées
      ====================================== */}

      {activeSection === "terminee" && (
        <div className="flex items-center gap-3 mb-4">
          <label className="font-medium">
            Mois :
          </label>

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
            className="border rounded-md px-3 py-2 bg-white"
          >
            <option value={1}>Janvier</option>
            <option value={2}>Février</option>
            <option value={3}>Mars</option>
            <option value={4}>Avril</option>
            <option value={5}>Mai</option>
            <option value={6}>Juin</option>
            <option value={7}>Juillet</option>
            <option value={8}>Août</option>
            <option value={9}>Septembre</option>
            <option value={10}>Octobre</option>
            <option value={11}>Novembre</option>
            <option value={12}>Décembre</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value))
            }
            className="border rounded-md px-3 py-2 bg-white"
          >
            {Array.from(
              { length: 5 },
              (_, index) =>
                new Date().getFullYear() - index
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ======================================
          Tableau des tâches
      ====================================== */}

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

            <th className="border p-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border p-6 text-center text-gray-500"
              >
                Aucune tâche dans cette section
              </td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task._id}>
                {/* Client */}
                <td className="border p-3">
                  {task.client
                    ? `${task.client.firstName} ${task.client.lastName}`
                    : "Client supprimé"}
                </td>

                {/* Service */}
                <td className="border p-3">
                  {task.service
                    ? task.service.name
                    : "Service supprimé"}
                </td>

                {/* Prix */}
                <td className="border p-3">
                  {task.clientPrice} DA
                </td>

                {/* Date limite */}
                <td className="border p-3">
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                {/* Statut */}
                <td className="border p-3">
                  {task.status}
                </td>

                {/* Actions */}
                <td className="border p-3">
                  {/* Nouvelle et non prise */}
                  {task.status === "nouvelle" &&
                  !task.employee ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() =>
                          handleCancel(task._id)
                        }
                      >
                        Annuler
                      </button>
                    </div>
                  ) : task.status === "annulee" ? (
                    /* Tâche annulée */
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded"
                      onClick={() =>
                        handleReactivate(task._id)
                      }
                    >
                      Réactiver
                    </button>
                  ) : (
                    /* Tâche prise ou terminée */
                    <span className="text-gray-500">
                      Non modifiable
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
