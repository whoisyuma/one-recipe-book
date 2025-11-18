'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFolder(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const name = formData.get('folderName')?.toString();
  if (!name || name.trim().length === 0) {
    return;
  }

  const { data, error: userError } = await supabase
    .auth
    .getUser();
  const user = data.user;
  if (!user || userError) {
      redirect('/login');
  }

  const { error } = await supabase
    .from('folders')
    .insert({ 
      name: name.trim(), 
      user_id: user.id
    });
  if (error) {
    console.error('フォルダの作成に失敗しました:', error);
  }

  revalidatePath('/folders');
}

export async function deleteFolder(folderId: string) {
  const supabase = await createClient();

  const { data, error: userError } = await supabase
    .auth
    .getUser();
  const user = data.user;
  if (!user || userError) {
    redirect('/login');
  }


  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId);
  if (error) {
    console.error('削除失敗:', error.message);
    throw new Error('フォルダの削除に失敗しました。');
  }

  revalidatePath('/folders');
}