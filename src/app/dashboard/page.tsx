'use client'

import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('transactions')
        .select('*, categories(name)')
        .order('date', { ascending: false })
      setTransactions(data || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  const dataByCategory = transactions.reduce((acc, t) => {
    const catName = t.categories?.name || (t.type === 'income' ? 'درآمد متفرقه' : 'هزینه متفرقه')
    const key = `${catName} (${t.type === 'income' ? 'درآمد' : 'هزینه'})`
    acc[key] = (acc[key] || 0) + Number(t.amount)
    return acc
  }, {} as Record<string, number>)

  const pieData = {
    labels: Object.keys(dataByCategory),
    datasets: [{
      data: Object.values(dataByCategory),
      backgroundColor: Object.keys(dataByCategory).map((label, i) => {
        if (label.includes('درآمد')) {
          return ['#10b981', '#22c55e', '#4ade80', '#86efac', '#6ee7b7'][i % 5] || '#10b981'
        } else {
          return ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'][i % 5] || '#ef4444'
        }
      }),
      borderWidth: 3,
      borderColor: '#111827',
      hoverOffset: 30,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          color: '#e5e7eb',
          padding: 15,
          font: { size: 13 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
            return `${value.toLocaleString()} تومان (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">داشبورد مالی</h1>

      {/* کارت‌های خلاصه */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-emerald-900/70 border-2 border-emerald-600 p-8 rounded-2xl text-center shadow-2xl">
          <p className="text-emerald-300 text-lg">جمع درآمد</p>
          <p className="text-4xl font-bold text-emerald-400 mt-3">
            {totalIncome.toLocaleString()} تومان
          </p>
        </div>
        <div className="bg-red-900/70 border-2 border-red-600 p-8 rounded-2xl text-center shadow-2xl">
          <p className="text-red-300 text-lg">جمع هزینه</p>
          <p className="text-4xl font-bold text-red-400 mt-3">
            {totalExpense.toLocaleString()} تومان
          </p>
        </div>
        <div className={`p-8 rounded-2xl text-center shadow-2xl border-4 ${balance >= 0 ? 'bg-emerald-900/80 border-emerald-500' : 'bg-red-900/80 border-red-500'}`}>
          <p className="text-xl font-medium">موجودی فعلی</p>
          <p className={`text-5xl font-bold mt-3 ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {balance.toLocaleString()} تومان
          </p>
        </div>
      </div>

      {/* نمودار + لیست — فقط یک بار نوشته شده! */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* نمودار */}
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 min-h-96 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-center">تفکیک درآمد و هزینه</h2>
          <div className="flex-1 flex items-center justify-center">
            {transactions.length > 0 ? (
              <Pie data={pieData} options={options} />
            ) : (
              <p className="text-center text-gray-400">هنوز تراکنشی ثبت نشده</p>
            )}
          </div>
        </div>

        {/* لیست جزئیات */}
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">جزئیات دسته‌بندی‌ها</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(dataByCategory)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([label, amount]) => (
                <div key={label} className="flex justify-between items-center bg-gray-700/60 p-4 rounded-xl">
                  <span className="text-gray-200 font-medium">{label}</span>
                  <span className={`font-bold text-lg ${label.includes('درآمد') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Number(amount).toLocaleString()} تومان
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}