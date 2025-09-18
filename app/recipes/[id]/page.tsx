import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';
import { redirect } from 'next/navigation'
import { deleteRecipe } from './actions';

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

export default async function RecipeDetailPage({ params }: {params: {id: string}}) {
    const { id } = await params
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
            <div className="flex flex-col justify-between items-start mb-15">
                {recipe.image_url && (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-80 object-cover rounded-md shadow-md mb-6"
                    />
                )}
                <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
            </div>

            <div className='mb-15 max-w-1/2'>
                <h2 className='text-2xl font-bold text-gray-800 mb-3'>材料</h2>
                <ul>
                    {recipe.ingredients?.map((ingredient: {name: string, amount: string}, index: number) => (
                        <li key={index}>
                            <div className="flex justify-between mb-1 border-b">
                                <span>{ingredient.name}</span>
                                <span>{ingredient.amount}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='mb-15'>
                <h2 className='text-2xl font-bold text-gray-800 mb-3'>手順</h2>
                <ol className="list-decimal ml-5">
                    {recipe.steps?.map((step: string, index: number) => (
                        <li key={index}>
                            <p className='pl-1 mb-1'>{step}</p>
                        </li>
                    ))}
                </ol>
            </div>

            <div className='flex justify-between gap-2'>
                <Link href={`/recipes/${recipe.id}/edit`} className='w-1/2 text-center py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500'>レシピを編集</Link>
                <form action={deleteRecipe} className='w-1/2 text-center py-3 bg-red-500 text-white rounded-md hover:bg-red-600'>
                    <input type="hidden" name='id' value={recipe.id}/>
                    <button type='submit'>
                        レシピを削除
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
