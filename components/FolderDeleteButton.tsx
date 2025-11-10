'use client'

import { deleteFolder } from "@/app/folders/actions";
import { useTransition } from "react"

export default function FolderDeleteButton({ folderId }: { folderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('このフォルダを削除しますか？')) return;

    startTransition(async () => {
      try {
        await deleteFolder(folderId);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="フォルダを削除"
      className="text-red-500 hover:text-red-700 text-lg ml-2"
    >
      ✖
    </button>
  )
}