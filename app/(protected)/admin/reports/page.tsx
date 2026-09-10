"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  name: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
  role?: string;
  niveau?: string;
  isActive?: boolean;

  newTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  profit: number;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await fetch("/api/users/reports", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error);
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Rapport des employés
      </h1>

      <table className="w-full border border-collapse">

        <thead>
          <tr className="bg-gray-100">

            <th className="border p-3">
              Employé
            </th>

            <th className="border p-3">
              En cours
            </th>

            <th className="border p-3">
              Terminés
            </th>

            <th className="border p-3">
              Honoraire_employe
            </th>

            <th className="border p-3">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {reports.map((employee) => (

            <tr key={employee.id}>

              {/* Nom de l'employé */}
              <td className="border p-3">
                {employee.name}
              </td>

              {/* Tâches en cours */}
              <td className="border p-3 text-center">
                {employee.inProgressTasks}
              </td>

              {/* Tâches terminées */}
              <td className="border p-3 text-center">
                {employee.completedTasks}
              </td>

              {/* Honoraire */}
              <td className="border p-3 text-center">
                {employee.profit} DA
              </td>

              {/* Actions */}
              <td className="border p-3 text-center">

                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    window.location.href = `/admin/reports/${employee.id}`
                  }
                >
                  Voir détails
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}