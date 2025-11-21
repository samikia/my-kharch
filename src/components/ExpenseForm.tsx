'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../app/lib/supabase'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

type Props = { onAdd: () => void }

export default function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [categoryId, setCategoryId] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])
  const [date, setDate] = useState<Date | null>(new Date())

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('id, name, type')
      setCategories(data || [])
    }
    loadCategories()
  }, [])

  const filteredCategories = categories.filter(cat => cat.type === type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !description || !date) return

    const formattedDate = date.toISOString().split('T')[0]

    const { error } = await supabase.from('transactions').insert({
      amount: parseFloat(amount),
      description,
      type,
      category_id: categoryId ? parseInt(categoryId) : null,
      date: formattedDate,
    })

    if (!error) {
      setAmount('')
      setDescription('')
      setCategoryId('')
      setDate(new Date())
      onAdd()
    } else {
      alert('خطا: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 mb-10 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <input type="number" placeholder="مبلغ (تومان)" value={amount} onChange={e => setAmount(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white p-4 rounded-xl" required />

        <input type="text" placeholder="توضیح" value={description} onChange={e => setDescription(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white p-4 rounded-xl" required />

        <select value={type} onChange={e => { setType(e.target.value as any); setCategoryId('') }}
          className="bg-gray-700 border border-gray-600 text-white p-4 rounded-xl">
          <option value="expense">هزینه</option>
          <option value="income">درآمد</option>
        </select>

        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white p-4 rounded-xl" required>
          <option value="">دسته‌بندی</option>
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* تقویم فارسی فوق‌العاده قشنگ و حرفه‌ای */}
      <div className="mt-8 bg-gray-700 p-6 rounded-xl">
        <label className="block text-lg text-gray-300 mb-4">تاریخ تراکنش:</label>
        <DatePicker
          value={date}
          onChange={(d: any) => setDate(d?.toDate() || null)}
          calendar={persian}
          locale={persian_fa}
          inputClass="w-full bg-gray-600 text-white p-4 rounded-lg text-center text-lg cursor-pointer border border-gray-500"
          placeholder="انتخاب تاریخ شمسی"
        />
      </div>

      <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl text-xl transition shadow-lg">
        ثبت تراکنش
      </button>
    </form>
  )
}