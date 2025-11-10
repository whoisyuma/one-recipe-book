import AddRecipeButton from "@/components/AddRecipeButton";
import BackToFoldersPageButton from "@/components/BackFoldersPage";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface FolderPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function FoldersDetailPage({ params }: FolderPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: folder, error: folderError } = await supabase
    .from('folders')
    .select('id, name')
    .eq('id', id)
    .single();

  if (folderError || !folder) {
    notFound();
  }

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, title, created_at, image_url')
    .eq('folder_id', id)
    .order('created_at', { ascending: false });

  if (recipesError) {
    console.error('レシピ読み込み中にエラーが発生しました：', recipesError);
  }
    
  return (
    <div className="min-h-screen bg-amber-200">
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <BackToFoldersPageButton />
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-0 md:mb-10 mt-5">
          <h1 className="text-3xl md:text-4xl font-bold">
            Folder：{folder.name}
          </h1>
          <div className="flex justify-end mt-10 md:mt-0">
            <AddRecipeButton />
          </div>
        </div>
        {recipes?.length === 0 ? (
          <p className="text-center text-gray-700 mt-15">
            まだこのフォルダ内にレシピが登録されていません。
          </p>
        ): (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-3 md:mt-15">
            {recipes?.map((recipe) => (
              <li key={recipe.id}>
                <Link 
                  href={`/recipes/${recipe.id}`}
                  className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-200 p-4 cursor-pointer"
                >
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="ml-4 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {recipe.title}
                    </h2>
                    <time className="text-xs text-gray-500 mt-1">
                        {new Date(recipe.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}