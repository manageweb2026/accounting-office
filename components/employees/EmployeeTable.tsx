"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

type User = {
  _id: string;
  fullName: string;
  username: string;
  role: string;
  phone: string;
  isActive: boolean;
};

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function EmployeeTable({
  users,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-lg border bg-white">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>الاسم</TableHead>

            <TableHead>اسم المستخدم</TableHead>

            <TableHead>الدور</TableHead>

            <TableHead>الهاتف</TableHead>

            <TableHead>الحالة</TableHead>

            <TableHead className="text-center">
              العمليات
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {users.map((user) => (

            <TableRow key={user._id}>

              <TableCell>{user.fullName}</TableCell>

              <TableCell>{user.username}</TableCell>

              <TableCell>

                <Badge variant="outline">
                  {user.role}
                </Badge>

              </TableCell>

              <TableCell>{user.phone}</TableCell>

              <TableCell>

                <Badge
                  variant={
                    user.isActive
                      ? "default"
                      : "destructive"
                  }
                >
                  {user.isActive ? "نشط" : "موقوف"}
                </Badge>

              </TableCell>

              <TableCell>

                <div className="flex justify-center gap-2">

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}