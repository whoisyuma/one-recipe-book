'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isPending, setIsPending] = useState(false)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const { data, error } = await supabase.auth.signInWithPassword({email, password})

        setIsPending(false);

        if(error) {
            setError(error.message)
            return;
        }

        if (!data.user.confirmed_at) {
            setMessage('メール認証が完了していません。メールを確認して認証を完了してください。')
            return;
        }

        router.push("/folders");
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
                {error && <p className="text-red-500 mb-2 text-xs text-center">ログインに失敗しました。</p>}
                {message && <p className="text-green-600 mb-2 text-xs text-center">{message}</p>}
                <button type="submit" disabled={isPending} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    {isPending ? 'ログイン中...' : 'ログイン'}
                </button>
                <p className="mt-4 text-sm text-center">
                    アカウントがない？
                    <Link href="/signup" className="text-blue-500 underline">新規登録</Link>
                </p>
            </form>
        </div>
    )
}