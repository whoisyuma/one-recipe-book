'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Header() {
    const pathname = usePathname();
    const showHeader = pathname === "/recipes";
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            router.push('/recipes/create');
        })
    }

    return (
        <header className="flex justify-between lg:px-30 md:px-15 items-center px-6 py-4 bg-amber-300 shadow">
                <Link href='/recipes' className="text-xl font-bold text-gray-800 py-1.5">マイレシピ帳</Link>
                {showHeader && (
                    <button onClick={handleClick} disabled={isPending} className="bg-orange-400 text-white px-4 py-2 rounded-md font-medium shadow transition duration-200 hover:bg-orange-500 hover:scale-105 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
                        {isPending ? '読み込み中...' : '＋レシピを追加'}
                    </button>
                )}
        </header>
    )
}