"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menu = [
  {
    title: "accueil",
    href: "/employee",
    icon: FaHome,
  },
  {
    title: "Nouvelles tâches",
    href: "/employee/tasks",
    icon: FaUsers,
  },

  {
    title: "Mes tâches",
    href: "/employee/my_tasks",
    icon: FaUsers,
  },

   {
    title: "raport",
    href: "/employee/report",
    icon: FaUsers,
  },
 
 
  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen">

      <div className="text-center py-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold">

          Système de gestion comptable

        </h1>

      </div>

      <nav className="mt-6">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all
              ${
                active
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>

            </Link>
          );
        })}

      </nav>

      <div className="absolute bottom-0 w-72">

        <button
          className="flex items-center gap-4 w-full px-6 py-4 bg-red-600 hover:bg-red-700"
        >
          <FaSignOutAlt />

          تسجيل الخروج

        </button>

      </div>

    </aside>
  );
}