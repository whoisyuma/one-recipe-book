'use client'

import { useTransition } from "react"
import { deleteRecipe } from "./actions"
import { useRouter } from "next/navigation"

type Props = {
    recipeId: string
}

export default function RecipeActionButtons({ recipeId }: Props) {
    const router = useRouter();
    const [isPendingEdit, startEditTransition] = useTransition();
    const [isPendingDelete, startDeleteTransition] = useTransition();

    // 編集ボタン
    const handleEdit = () => {
        startEditTransition(() => {
            router.push(`/recipes/${recipeId}/edit`);
        })
    }

    // 削除ボタン
    const handleDelete = (formData: FormData) => {
        const confirmed = window.confirm('本当に削除してもよろしいですか？');
        if (!confirmed) return

        startDeleteTransition(() => {
            deleteRecipe(formData)
        })
    }
    
    return (
        <div className='flex justify-between gap-2'>
            <button onClick={handleEdit} disabled={isPendingEdit} className='w-1/2 text-center py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500'>
                {isPendingEdit ? '読み込み中...' : 'レシピを編集'}
            </button>
            <form action={handleDelete} className='w-1/2 text-center py-3 bg-red-500 text-white rounded-md hover:bg-red-600'>
                <input type="hidden" name='id' value={recipeId}/>
                <button type='submit' disabled={isPendingDelete}>
                    {isPendingDelete ? '削除中...' : 'レシピを削除'}
                </button>
            </form>
        </div>
    )
}