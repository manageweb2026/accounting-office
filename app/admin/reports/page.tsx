

"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  fullName: string;
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
  const res = await fetch("/api/users/reports", {
  credentials: "include",
  cache: "no-store",
});

  const data = await res.json();

  console.log("API RESPONSE:", data);

  if (data.success) {
    setReports(data.reports);
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

            <th className="border p-3">Employé</th>

            <th className="border p-3">En cours</th>

            <th className="border p-3">Terminés</th>

            <th className="border p-3">Honoraire_employe</th>

            <th className="border p-3">Actions</th>

          </tr>

        </thead>

        <tbody>

          {reports.map((employee) => (

            <tr key={employee.id}>

              <td className="border p-3">
                {employee.fullName}
              </td>


              <td className="border p-3 text-center">
                {employee.inProgressTasks}
              </td>

              <td className="border p-3 text-center">
                {employee.completedTasks}
              </td>

              <td className="border p-3 text-center">
                {employee.profit} DA
              </td>

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