'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddExpensePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category')
  const type = searchParams.get('type') || 'expense'

  const [amount, setAmount] = useState('')

  async function handleSubmit() {
    if (!amount) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }

    await supabase.from('transactions').insert({
      user_id: user.id,
      amount: parseFloat(amount),
      description: category || (type === 'income' ? 'درآمد' : 'هزینه'),
      type,
      category_id: null, // بعداً می‌تونی خودکار پیدا کنی
    })

    router.push('/quick-add')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-10 shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          {type === 'income' ? '➕ اضافه کردن درآمد' : '➖ اضافه کردن هزینه'}
        </h1>
        {category && (
          <p className="text-center text-2xl mb-8 text-blue-400">
            دسته: {category}
          </p>
        )}
        <input
          type="number"
          placeholder="مبلغ به تومان"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-gray-700 text-white p-6 rounded-xl text-2xl text-center mb-8"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 rounded-xl text-2xl font-bold hover:scale-105 transition"
        >
          اضافه کن و برگرد
        </button>
      </div>
    </div>
  )
}