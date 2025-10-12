import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import RecipeActionButtons from './RecipeActionButtons';

type Ingredient = {
    name: string;
    amount: string;
}

type Recipe = {
    id: string
    title: string
    image_url: string | null
    ingredients: Ingredient[]
    steps: string[]
    user_id: string
    created_at: string
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient()

    // 認証チェック
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        redirect('/login')
    }

    // レシピ取得
    const { data: recipe, error } = await supabase.from('recipes').select('*').eq('id', id).single<Recipe>()

    if (error || !recipe) {
        console.log('error', error.message)
        return <p>レシピの取得に失敗しました</p>
    }

    return (
    <div className="min-h-screen bg-amber-200">
        <div className="max-w-3xl mx-auto py-12 px-5">
            <div className="flex flex-col justify-between items-start mb-10 lg:mb-15">
                {recipe.image_url && (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full md:h-95 h-60 object-cover rounded-md shadow-md mb-6"
                    />
                )}
                <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
            </div>

            <div className='mb-10 lg:mb-15 max-w-xl bg-white rounded-xl p-3 lg:p-5'>
                <h2 className='text-2xl font-bold text-gray-800 mb-1'>材料</h2>
                <div className="w-12 h-1 bg-amber-500 mb-4 rounded" />
                <ul>
                    {recipe.ingredients?.map((ingredient: {name: string, amount: string}, index: number) => (
                        <li key={index}>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-800">{ingredient.name}</span>
                                <span className="text-gray-600">{ingredient.amount}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='mb-10 lg:mb-15 bg-white rounded-xl p-5'>
                <h2 className='text-2xl font-bold text-gray-800 mb-1'>手順</h2>
                <div className="w-12 h-1 bg-amber-500 mb-4 rounded" />
                <ol>
                    {recipe.steps?.map((step: string, index: number) => (
                        <li key={index} className="mb-3 flex">
                            <span className="font-bold text-amber-500 mr-2">{index + 1}.</span>
                            <p className='text-gray-700'>{step}</p>
                        </li>
                    ))}
                </ol>
            </div>

            <RecipeActionButtons recipeId={recipe.id}/>
        </div>
    </div>
  )
}
