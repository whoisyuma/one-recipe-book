import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import BackToFoldersPageButton from '@/components/BackFoldersPage';
import RecipeDetailActionButtons from '@/components/RecipeDetailActionButtons';

interface Ingredient {
  name: string;
  amount: string;
}

interface Folder {
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

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase
    .auth
    .getUser();
  if (userError || !user) {
      redirect('/login');
  }

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(`*, folder:folder_id(name)`)
    .eq('id', id)
    .single<Recipe>();
  if (error || !recipe) {
    console.log('error', error.message)
    return <p>レシピの取得に失敗しました。</p>
  }

  const folderName = recipe.folder?.name || '未分類';

  return (
    <div className="min-h-screen bg-amber-200">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-5">
        <BackToFoldersPageButton />
        <div className="flex flex-col justify-between items-start mt-5 mb-3 md:mb-10 lg:mb-15">
          {recipe.image_url && (
            <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full md:h-95 h-60 object-cover rounded-md shadow-md mb-6"
            />
          )}
          <div className='w-full flex flex-col md:flex-row md:items-center md:justify-between'>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-7 md:mb-0">
              {recipe.title}
            </h1>
            <div className='flex justify-end md:justify-normal items-center'>
              <img
                src="/icons/black-folder.svg"
                alt="フォルダ画像" 
                className='w-4 h-4 md:w-6 md:h-6'
              />
              <p className='text-sm md:text-lg'>
                ：{folderName}
              </p>
            </div>
          </div>
        </div>

        <div className='mb-10 lg:mb-15 max-w-xl bg-white rounded-xl p-3 lg:p-5'>
          <h2 className='text-2xl font-bold text-gray-800 mb-1'>
            材料
          </h2>
          <div className="w-12 h-1 bg-amber-500 mb-4 rounded" />
          <ul>
            {recipe.ingredients?.map(
              (ingredient: Ingredient, index: number) => (
              <li key={index}>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-800">
                    {ingredient.name}
                  </span>
                  <span className="text-gray-600">
                    {ingredient.amount}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='mb-10 lg:mb-15 bg-white rounded-xl p-5'>
          <h2 className='text-2xl font-bold text-gray-800 mb-1'>
            手順
          </h2>
          <div className="w-12 h-1 bg-amber-500 mb-4 rounded" />
          <ol>
            {recipe.steps?.map((step: string, index: number) => (
              <li key={index} className="mb-3 flex">
                <span className="font-bold text-amber-500 mr-2">
                  {index + 1}.
                </span>
                <p className='text-gray-700'>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <RecipeDetailActionButtons recipeId={recipe.id} />
      </div>
    </div>
  )
}