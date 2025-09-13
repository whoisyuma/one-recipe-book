'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // アカウント作成の機能実装(成功したらログインページに遷移)
    const handleSignup = async(e: React.FormEvent) => {
        e.preventDefault();
        const {error} = await supabase.auth.signUp({email, password});
        if (error) {
            setError(error.message)
        } else {
            router.push('/login')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-200">
            <form onSubmit={handleSignup} className="border bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">新規登録</h2>
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
                {error && <p className="text-red-500 mb-2">新規登録に失敗しました</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    登録
                </button>
                <p className="mt-4 text-sm text-center">
                    すでにアカウントがある？
                    <Link href="/login" className="text-blue-500 underline">ログイン</Link>
                </p>
            </form>
        </div>
    )
}