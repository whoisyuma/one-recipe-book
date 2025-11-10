'use client'

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const { error } = await supabase
      .auth
      .signOut();

    setIsLoggingOut(false);

    if (error) {
        console.error('ログアウト中にエラーが発生しました：', error);
        return;
    }

    router.refresh();
  }

  return (
    <header className="flex justify-between lg:px-30 md:px-15 items-center px-6 py-4 bg-amber-300 shadow">
      <Link 
        href='/folders' 
        className="text-xl font-bold text-gray-800 py-1.5"
      >
        マイレシピ帳
      </Link>
      <button 
        onClick={handleLogout} 
        disabled={isLoggingOut} 
        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium shadow transition duration-200 hover:bg-red-600 hover:scale-105 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
      </button>
    </header>
  )
}