import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Recipespage() {
    const supabase = await createClient()

    // ユーザー情報の取得
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();

    if (!user || !session) {
        redirect('/login')
    }

    // データの取得
    const { data: recipes, error } = await supabase.from('recipes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

    if (error) {
        return <p>データの取得に失敗しました。</p>
    }

    return (
        <div className="min-h-screen bg-amber-200">
            <div className="max-w-5xl mx-auto py-12 px-4">
                {recipes.length === 0 ? (
                    <p className="text-center text-gray-700">まだレシピが登録されていません。</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {recipes.map((recipe) => (
                            <li key={recipe.id}>
                                <Link href={`/recipes/${recipe.id}`} className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-200 p-4 cursor-pointer">
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                />
                                <div className="ml-4 flex flex-col">
                                    <h2 className="text-lg font-semibold text-gray-800">{recipe.title}</h2>
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