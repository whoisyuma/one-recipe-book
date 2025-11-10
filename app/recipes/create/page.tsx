import BackToFoldersPageButton from "@/components/BackFoldersPage";
import Header from "@/components/Header";
import RecipeCreateForm from "@/components/RecipeCreateForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RecipeCreatePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase
    .auth
    .getUser();
    
  if (!user) {
    redirect('/');
  }

  const { data: folders, error } = await supabase
    .from('folders')
    .select('id, name')
    .order('name', { ascending: true });

  return (
    <div className="min-h-screen bg-amber-200 pb-5 md:pb-15">
      <Header />
      <div className="max-w-3xl mx-auto px-3 md:px-0 mt-15">
        <BackToFoldersPageButton />
        <div className="py-12 px-5 bg-white rounded mt-5">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            レシピを作成
          </h1>
          <RecipeCreateForm folders={folders || []} />
        </div>
      </div>
   </div>
  )
}
