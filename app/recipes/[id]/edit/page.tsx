import Header from '@/components/Header';
import BackToFoldersPageButton from '@/components/BackFoldersPage';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import RecipeEditForm from '@/components/RecipeEditForm';

interface Ingredient {
  name: string;
  amount: string;
}

interface Folder {
  id: string;
  name: string;
}

interface Recipe {
  id: string;
  title: string;
  folder_id: string | null;
  folder: Folder| null;
  image_url: string | null;
  ingredients: Ingredient[];
  steps: string[];
  user_id: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id: recipeId } = await params;
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase
    .auth
    .getUser();
  if (userError || !user) {
    redirect('/login');
  }

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select(`*, folder:folder_id(id, name)`)
    .eq('id', recipeId)
    .single<Recipe>();
  if (!recipe || recipeError) {
    console.error('レシピの取得に失敗しました。');
    return <p>レシピが見つかりません。</p>
  }

  const { data: folders, error: foldersError } = await supabase
    .from('folders')
    .select('id, name')
    .order('name', { ascending: true });
  if (foldersError) {
    console.error('フォルダの取得に失敗しました。');
  }

  return (
    <div className="min-h-screen bg-amber-200 pb-10">
      <Header />
      <div className="max-w-3xl mt-10 mx-2 md:mx-auto">
        <BackToFoldersPageButton />
        <div className='py-12 px-5 mt-5 bg-white rounded'>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            レシピを編集
          </h1>

          <RecipeEditForm 
            recipeId={recipeId}
            previousRecipeData={recipe}
            folders={folders || []}
          />
        </div>
      </div>
    </div>
  )
}
