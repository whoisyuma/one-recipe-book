'use client'

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, setIsPending] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const { data, error } = await supabase
      .auth
      .signUp({email, password});
    setIsPending(false);

    if (error) {
      setError(error.message);
    } else {
      if (!data.user?.confirmed_at) {
        setMessage('確認メールを送信しました。メール認証を完了してログインしてください。');
        setError('');
      } else {
        router.push('/login');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-200">
      <form 
        onSubmit={handleSignup} 
        className="border bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">
          新規登録
        </h2>
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
        {error && 
          <p className="text-red-500 mb-2 text-xs text-center">
            新規登録に失敗しました。
          </p>
        }
        {message && 
          <p className="text-green-600 mb-2 text-xs text-center">
            {message}
          </p>
        }
        <button 
          type="submit" 
          disabled={isPending} 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isPending ? '登録中...' : '新規登録'}
        </button>
        <p className="mt-4 text-sm text-center">
            すでにアカウントがある？
            <Link 
              href="/login" 
              className="text-blue-500 underline"
            >
              ログイン
            </Link>
        </p>
      </form>
    </div>
  )
}