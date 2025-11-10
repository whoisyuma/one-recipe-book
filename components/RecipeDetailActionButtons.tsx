'use client'

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/app/recipes/[id]/actions";

interface Props {
  recipeId: string
}

export default function RecipeDetailActionButtons({ recipeId }: Props) {
  const router = useRouter();
  const [isPendingEdit, startEditTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    startEditTransition(() => {
      router.push(`/recipes/${recipeId}/edit`);
    });
  }

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window
      .confirm('本当に削除してもよろしいですか？');
    if (!confirmed) return;

    startDeleteTransition(async () => {
      try {
        const formData = new FormData(e.currentTarget);
        await deleteRecipe(formData);
        router.push('/folders');
      } catch (error) {
        console.error(error);
        setError('削除に失敗しました。もう一度お試しください。')
      }
    });
  }
    
  return (
    <div className='flex justify-between gap-2'>
      {error && (
        <p className="text-red-600 text-sm text-center my-2">
          {error}
        </p>
      )}
      <button 
        onClick={handleEdit} 
        disabled={isPendingEdit} 
        className='w-1/2 text-center py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500'
      >
        {isPendingEdit ? '読み込み中...' : 'レシピを編集'}
      </button>
      <form 
        onSubmit={handleDelete}
        className='w-1/2 text-center py-3 bg-red-500 text-white rounded-md hover:bg-red-600'
      >
        <input 
          type="hidden" 
          name='id' 
          value={recipeId}
        />
        <button 
          type='submit' 
          disabled={isPendingDelete}
        >
          {isPendingDelete ? '削除中...' : 'レシピを削除'}
        </button>
      </form>
    </div>
  )
}