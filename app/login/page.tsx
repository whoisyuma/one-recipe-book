'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // ログインボタンの実装（成功すればrecipesページに遷移）
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const {error} = await supabase.auth.signInWithPassword({email, password})
        if(error) {
            setError(error.message)
        } else {
            router.push("/recipes");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-200">
            <form onSubmit={handleLogin} className="border bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">ログイン</h2>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full mb-2 p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    className="w-full mb-2 p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 mb-2">ログインに失敗しました</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    ログイン
                </button>
                <p className="mt-4 text-sm text-center">
                    アカウントがない？
                    <Link href="/signup" className="text-blue-500 underline">新規登録</Link>
                </p>
            </form>
        </div>
    )
}