'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteRecipe(formData: FormData): Promise<void> {
  const recipeId = formData.get('id') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase
    .auth
    .getUser();
  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId);
  if (error) {
    console.error('削除失敗:', error.message);
    throw new Error('レシピの削除に失敗しました。');
  }

  revalidatePath('/recipes');
}
