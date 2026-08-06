"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteConfirmationProps = {
  title?: string;
  description?: string;
  onConfirm: () => void;
  children: React.ReactNode;
};

export default function DeleteConfirmation({
  title = "Confirmer la suppression",
  description = "Cette action est irréversible.",
  onConfirm,
  children,
}: DeleteConfirmationProps) {
  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

   <AlertDialogContent className="!max-w-sm w-[380px] rounded-xl">

  <AlertDialogHeader className="space-y-3">

    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
      <span className="text-2xl">🗑️</span>
    </div>

    <AlertDialogTitle className="text-center text-xl font-bold">
      {title}
    </AlertDialogTitle>

    <AlertDialogDescription className="text-center">
      {description}
    </AlertDialogDescription>

  </AlertDialogHeader>

  <AlertDialogFooter className="flex-row-reverse gap-2">

    <AlertDialogAction
      onClick={onConfirm}
      className="bg-red-600 hover:bg-red-700"
    >
      Supprimer
    </AlertDialogAction>

    <AlertDialogCancel>
      Annuler
    </AlertDialogCancel>

  </AlertDialogFooter>

</AlertDialogContent>

    </AlertDialog>
  );
}