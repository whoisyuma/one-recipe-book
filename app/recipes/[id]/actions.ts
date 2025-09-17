'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteRecipe(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  const { error } = await supabase.from('recipes').delete().eq('id', id)

  if (error) {
    console.error('削除失敗:', error)
    throw new Error('削除に失敗しました')
  }

  revalidatePath('/recipes')
  redirect('/recipes')
}
