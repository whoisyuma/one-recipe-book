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

     // 仮のダミーレシピ
    const recipes = [
    {
      id: 1,
      title: 'トマトパスタ',
      imageUrl: 'https://images.microcms-assets.io/assets/350e9469fdfe46fca67affb04137957c/00df9c14b2d34bfd82573fc1da5ac4d3/obecnidum.jpeg',
    },
    {
      id: 2,
      title: 'オムライス',
      imageUrl: 'https://images.microcms-assets.io/assets/350e9469fdfe46fca67affb04137957c/99c12ef0fe534a0b85d8a6d0d063a21c/lunch2.jpeg',
    },
    ]

    return (
        <div className="min-h-screen bg-amber-200">
            <div className="max-w-5xl mx-auto py-12 px-4">
                {recipes.length === 0 ? (
                    <p className="text-center text-gray-700">まだレシピがありません。</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <Link key={recipe.id} href='/'>
                                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                    <img
                                        src={recipe.imageUrl}
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