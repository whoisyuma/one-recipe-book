'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateRecipe(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const folderId = formData.get('folderId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const ingredients = JSON.parse(formData.get('ingredients') as string);
  const steps = JSON.parse(formData.get('steps') as string);

  const finalFolderId = folderId || null;

  const { data: { user }, error: userError } = await supabase
    .auth
    .getUser();
  if (!user || userError) {
    redirect('/login');
  }

  const { error } = await supabase
    .from('recipes')
    .update({
      title,
      folder_id: finalFolderId,
      image_url: imageUrl,
      ingredients,
      steps,
    })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) {
    console.error('更新失敗：', error.message);
    return { error: 'レシピの更新に失敗しました。'};
  }

  revalidatePath(`/recipes/${id}`);
  revalidatePath('/recipes');

  return { success: true, recipeId: id};
}
