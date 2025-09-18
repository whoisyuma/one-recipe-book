'use client'

import Link from "next/link"
import { usePathname } from "next/navigation";

export default function RecipesLayout({children}: {children: React.ReactNode;}) {
    const pathname = usePathname();
    const showHeader = pathname === "/recipes";

    return (
        <div>
            <header className="flex justify-between items-center px-6 py-4 bg-amber-300 shadow">
                <Link href='/recipes' className="text-xl font-bold text-gray-800 py-1.5">マイレシピ帳</Link>
                {showHeader && (
                    <Link href="/recipes/create" className="bg-orange-400 text-white px-4 py-2 rounded-md font-medium shadow transition duration-200 hover:bg-orange-500 hover:scale-105 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">＋レシピを追加</Link>
                )}
            </header>

            <main>{children}</main>
        </div>
    )
    
}