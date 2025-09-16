import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Recipespage() {
    const supabase = await createClient()

    // ユーザー情報の取得
    const { data: {session} } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login')
    }

    // データの取得
    const { data: recipes, error } = await supabase.from('recipes').select('*');

    if (error) {
        return <p>データの取得に失敗しました。</p>
    }

    return (
        <div className="min-h-screen bg-amber-200">
            <div className="max-w-5xl mx-auto py-12 px-4">
                {recipes.length === 0 ? (
                    <p className="text-center text-gray-700">まだレシピがありません。</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                    <img
                                        src={recipe.image_url}
                                        alt={recipe.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800">{recipe.title}</h2>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}