'use client'

import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)

      // اگر تو جدول profiles نام داشته باشه، بگیر
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (data?.full_name) setFullName(data.full_name)
      setLoading(false)
    }
    getUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  async function handleSaveName() {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName })

    if (!error) {
      alert('نام با موفقیت ذخیره شد')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-xl text-gray-300">در حال بارگذاری...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <h1 className="text-4xl font-bold mb-10 text-center">پروفایل من</h1>

          <div className="space-y-6">
            {/* آواتار */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>

            {/* ایمیل */}
            <div>
              <label className="block text-gray-400 mb-2">ایمیل</label>
              <p className="text-xl bg-gray-700 px-5 py-3 rounded-lg">{user?.email}</p>
            </div>

            {/* نام کامل */}
            <div>
              <label className="block text-gray-400 mb-2">نام کامل (اختیاری)</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className="w-full bg-gray-700 text-white px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveName}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
              >
                ذخیره نام
              </button>
            </div>

            {/* اطلاعات فنی */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>شناسه کاربر: <span className="text-gray-400">{user?.id}</span></p>
              <p>آخرین ورود: <span className="text-gray-400">
                {new Date(user?.last_sign_in_at || '').toLocaleString('fa-IR')}
              </span></p>
            </div>

            {/* دکمه خروج */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-xl transition shadow-lg mt-10"
            >
              خروج از حساب
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500">
          اپ حسابداری شخصی • ساخته شده با ❤️ و Next.js + Supabase
        </p>
      </div>
    </div>
  )
}