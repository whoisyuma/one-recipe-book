'use client'

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AddRecipeButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push('/recipes/create');
    })
  }

  return (
    <button 
      onClick={handleClick} 
      disabled={isPending} 
      className="bg-orange-400 text-white px-4 py-2 rounded-md font-medium shadow transition duration-200 hover:bg-orange-500 hover:scale-105 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
    >
      {isPending ? '読み込み中...' : '＋レシピを追加'}
    </button>
  )
}