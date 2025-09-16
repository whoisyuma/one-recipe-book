import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
                <div className="flex flex-col justify-between items-start mb-4">
                    {recipe.image_url && (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-64 object-cover rounded-md shadow-md mb-6"
                        />
                    )}
                    <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>

                    {/* <RecipeActions recipe={recipe}/> */}
                </div>

                <div>
                    <h2>材料</h2>
                    <ul>
                        {recipe.ingredients?.map((ingredient: {name: string, amount: string}, index: number) => (
                            <li key={index}>
                                {ingredient.name}:{ingredient.amount}
                            </li>
                        ))}
                    </ul>
                </div>


                <div>
                    <h2>手順</h2>
                    <ol className="list-decimal list-inside">
                        {recipe.steps?.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

            </div>
        </div>
  )
}
