'use client'

import { supabase } from '../app/lib/supabase'
import { useEffect, useState } from 'react'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import { redirect } from 'next/navigation'

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  // تابع لود تراکنش‌ها رو بیرون useEffect تعریف کن
  const loadTransactions = async (userId: string) => {
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    setTransactions(data || [])
  }

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        redirect('/auth')
      }
      setUser(session.user)
      await loadTransactions(session.user.id) // حالا می‌شناسه!
    }

    checkUser()

    // وقتی وضعیت ورود تغییر کرد (لاگین/لاگ‌اوت)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadTransactions(session.user.id)
      } else {
        redirect('/auth')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('مطمئنی می‌خوای حذف کنی؟')) return
    await supabase.from('transactions').delete().eq('id', id)
    if (user) await loadTransactions(user.id)
  }

  const handleAdd = async () => {
    if (user) await loadTransactions(user.id)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-300">در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">حسابداری شخصی من</h1>
        
        <ExpenseForm onAdd={handleAdd} />
        <ExpenseList 
          transactions={transactions} 
          onDelete={handleDelete} 
          onUpdate={handleAdd} 
        />
      </div>
    </div>
  )
}