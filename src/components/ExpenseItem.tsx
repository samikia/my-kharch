'use client'

import { useState } from 'react'
import { supabase } from '../app/lib/supabase'
type Transaction = {
  id: number
  amount: number
  description: string
  type: 'expense' | 'income'
  date: string
  categories?: { name: string } | null
}

type Props = {
  transaction: Transaction
  onDelete: (id: number) => void
  onUpdate: () => void
}

export default function ExpenseItem({ transaction, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState(transaction.amount.toString())
  const [editDesc, setEditDesc] = useState(transaction.description)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: parseFloat(editAmount),
        description: editDesc
      })
      .eq('id', transaction.id)

    if (!error) {
      setIsEditing(false)
      onUpdate()
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="flex gap-3 items-center bg-gray-700 p-4 rounded-xl">
        <input
          type="number"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-32"
          required
        />
        <input
          type="text"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="bg-gray-600 text-white p-2 rounded flex-1"
          required
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded">ذخیره</button>
        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 px-4 py-2 rounded">لغو</button>
      </form>
    )
  }

  return (
    <div className={`p-6 rounded-2xl shadow-xl border ${transaction.type === 'income' ? 'bg-emerald-900/50 border-emerald-700' : 'bg-red-900/50 border-red-700'}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <strong className="text-2xl">{transaction.description}</strong>
            {transaction.categories && (
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full text-gray-300">
                {transaction.categories.name}
              </span>
            )}
          </div>
          <small className="block text-gray-400 mt-1">
            {new Date(transaction.date).toLocaleDateString('fa-IR')}
          </small>
        </div>

        <div className="flex items-center gap-6">
          <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
            {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString()} تومان
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm">
              ویرایش
            </button>
            <button onClick={() => onDelete(transaction.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}