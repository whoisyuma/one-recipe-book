'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRecipe(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const imageUrl = formData.get('imageUrl') as string
    const ingredients = JSON.parse(formData.get('ingredients') as string)
    const steps = JSON.parse(formData.get('steps') as string)

    // ユーザー認証
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        redirect('/login')
    }

    // 編集対象レコードを更新
    const { error } = await supabase.from('recipes').update({
            title,
            image_url: imageUrl,
            ingredients,
            steps,
        })
        .eq('id', id)
        .eq('user_id', user.id) // 他人のレシピを編集できないようにする

    if (error) {
        throw new Error('レシピの更新に失敗しました')
    }

    revalidatePath(`/recipes/${id}`) // キャッシュ更新
    redirect('/recipes')
}
