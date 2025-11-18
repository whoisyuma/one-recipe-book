'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createRecipe(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const folderId = formData.get('folderId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const ingredients = JSON.parse(formData.get('ingredients') as string);
  const steps = JSON.parse(formData.get('steps') as string);

  const { data: { user }, error: userError } = await supabase
    .auth
    .getUser();
  if (!user || userError) {
    redirect('/login');
  }

  const finalFolderId = folderId || null;

  const { error } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      title,
      folder_id: finalFolderId,
      ingredients,
      steps,
      image_url: imageUrl,
  });
  if (error) {
    console.error('DB Insert Error', error);
    return { error: 'レシピの保存に失敗しました。'};
  }

  revalidatePath('/folders');
  revalidatePath('/recipes');
  
  if (finalFolderId) {
    revalidatePath(`/folders/${finalFolderId}`);
  }

  return { success: true };
}
