'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAuth() {
    setLoading(true)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('ثبت‌نام موفق! حالا وارد شو')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isLogin ? 'ورود' : 'ثبت‌نام'}
        </h1>
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white p-4 rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-700 text-white p-4 rounded-lg mb-6"
        />
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg"
        >
          {loading ? 'در حال پردازش...' : (isLogin ? 'ورود' : 'ثبت‌نام')}
        </button>
        <p className="text-center mt-6 text-gray-400">
          {isLogin ? 'حساب نداری؟' : 'حساب داری؟'}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 ml-1">
            {isLogin ? 'ثبت‌نام کن' : 'وارد شو'}
          </button>
        </p>
      </div>
    </div>
  )
}