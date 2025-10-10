'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createRecipe(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const imageUrl = formData.get('imageUrl') as string
    const ingredients = JSON.parse(formData.get('ingredients') as string)
    const steps = JSON.parse(formData.get('steps') as string)

    // ユーザー認証
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        redirect('/login')
    }

    // データをデータベースに保存
    const { error } = await supabase.from('recipes').insert({
        user_id: user.id,
        title,
        ingredients,
        steps,
        image_url: imageUrl,
    })

    if (error) {
        throw new Error('レシピの保存に失敗しました')
    }

    redirect('/recipes')
}
