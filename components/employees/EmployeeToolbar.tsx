"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

type EmployeeToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
};

export default function EmployeeToolbar({
  search,
  setSearch,
  onAdd,
}: EmployeeToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

        <Input
          placeholder="ابحث عن موظف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        إضافة موظف
      </Button>
    </div>
  );
}