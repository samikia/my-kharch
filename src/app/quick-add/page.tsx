// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { 
//   Home, Car, Cat, Shirt, Thermometer, Dumbbell, 
//   Utensils, Phone, Gift, Coffee, Bus, HeartPulse,
//   Plus, Minus 
// } from 'lucide-react'

// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip
// } from 'recharts'
// import { supabase } from '../lib/supabase'
// export default function QuickAddPage() {
//   const router = useRouter()
// const [chartData, setChartData] = useState<Record<string, number>>({})
//   const categories = [
//     { name: 'خانه', icon: Home, color: 'text-blue-400', bg: 'bg-blue-900/50' },
//     { name: 'خوراک', icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-900/50' },
//     { name: 'حمل‌ونقل', icon: Bus, color: 'text-purple-400', bg: 'bg-purple-900/50' },
//     { name: 'بهداشتی', icon: HeartPulse, color: 'text-pink-400', bg: 'bg-pink-900/50' },
//     { name: 'لباس', icon: Shirt, color: 'text-indigo-400', bg: 'bg-indigo-900/50' },
//     { name: 'تفریح', icon: Cat, color: 'text-yellow-400', bg: 'bg-yellow-900/50' },
//     { name: 'کافی‌شاپ', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-900/50' },
//     { name: 'هدیه', icon: Gift, color: 'text-rose-400', bg: 'bg-rose-900/50' },
//     { name: 'ورزش', icon: Dumbbell, color: 'text-green-400', bg: 'bg-green-900/50' },
//     { name: 'بیماری', icon: Thermometer, color: 'text-red-400', bg: 'bg-red-900/50' },
//     { name: 'تلفن', icon: Phone, color: 'text-cyan-400', bg: 'bg-cyan-900/50' },
//     { name: 'ماشین', icon: Car, color: 'text-gray-400', bg: 'bg-gray-900/50' },
//   ]

// const handleCategoryClick = async (name: string) => {
//   router.push(`/add-expense?category=${encodeURIComponent(name)}&type=expense`)
//   // یه کم صبر کن تا برگرده، بعد آپدیت کن
//   setTimeout(updateChart, 1000)
// }

// const handleIncome = async () => {
//   router.push('/add-expense?type=income')
//   setTimeout(updateChart, 1000)
// }
//   const handleExpense = () => {
//     router.push('/add-expense?type=expense')
//   }
// // این تابع رو بالای return بذار
// const updateChart = async () => {
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return

//   const { data } = await supabase
//     .from('transactions')
//     .select('amount, categories(name)')
//     .eq('user_id', user.id)

//   const summary: Record<string, number> = {}

//   data?.forEach(t => {
//     const catName = t.categories?.name || 'متفرقه'
//     summary[catName] = (summary[catName] || 0) + Number(t.amount)
//   })

//   setChartData(summary)
// }
// const getColorByCategory = (name: string) => {
//   const colors: Record<string, string> = {
//     خانه: '#60a5fa',
//     خوراک: '#fb923c',
//     'حمل‌ونقل': '#a78bfa',
//     بهداشتی: '#f472b6',
//     لباس: '#818cf8',
//     تفریح: '#fbbf24',
//     'کافی‌شاپ': '#f59e0b',
//     هدیه: '#f43f5e',
//     ورزش: '#34d399',
//     بیماری: '#ef4444',
//     تلفن: '#22d3ee',
//     ماشین: '#94a3b8',
//   }
//   return colors[name] || '#6b7280'
// }
//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
//           اضافه کردن سریع
//         </h1>

//         {/* دکمه‌های بزرگ + و - */}
//         <div className="flex justify-center gap-12 mb-16">
//           <button
//             onClick={handleIncome}
//             className="group relative w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
//           >
//             <Plus size={64} className="text-white" />
//             <span className="absolute -bottom-10 text-emerald-400 text-xl font-bold opacity-0 group-hover:opacity-100 transition">
//               درآمد
//             </span>
//           </button>

//           <button
//             onClick={handleExpense}
//             className="group relative w-32 h-32 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
//           >
//             <Minus size={64} className="text-white" />
//             <span className="absolute -bottom-10 text-red-400 text-xl font-bold opacity-0 group-hover:opacity-100 transition">
//               هزینه
//             </span>
//           </button>
//         </div>

//         {/* دایره آیکون‌ها */}
//         <div className="relative w-full h-96 flex items-center justify-center">
//           {/* نمودار دایره‌ای وسط (بعداً می‌تونی واقعی کنی) */}
//        <div className="absolute w-80 h-80">
//   <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={chartData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={90}
//                   outerRadius={150}
//                   paddingAngle={3}
//                   dataKey="value"
//                 >
//                   {chartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={categories.find(c => c.name === entry.name)?.color || '#6b7280'} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value: number) => `${value.toLocaleString()} تومان`}
//                   contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
// </div>

//           {/* آیکون‌های دور دایره */}
//           <div className="absolute inset-0">
//             {categories.map((cat, index) => {
//               const angle = (index * 360) / categories.length
//               const radius = 180
//               const x = Math.cos((angle * Math.PI) / 180) * radius
//               const y = Math.sin((angle * Math.PI) / 180) * radius

//               return (
//                 <button
//                   key={cat.name}
//                   onClick={() => handleCategoryClick(cat.name)}
//                   style={{
//                     transform: `translate(${x}px, ${y}px)`,
//                   }}
//                   className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
//                     w-16 h-16 ${cat.bg} border-4 border-gray-700 rounded-full 
//                     flex items-center justify-center shadow-2xl 
//                     hover:scale-125 hover:z-10 transition-all duration-300 group`}
//                 >
//                   <cat.icon size={32} className={cat.color} />
//                   <span className="absolute -bottom-8 text-xs opacity-0 group-hover:opacity-100 transition">
//                     {cat.name}
//                   </span>
//                 </button>
//               )
//             })}
//           </div>
//         </div>

//         <p className="text-center mt-20 text-gray-400 text-lg">
//           روی آیکون بزن تا هزینه‌ش رو سریع اضافه کنی!
//         </p>
//       </div>
//     </div>
//   )
// }

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Home, Car, Cat, Shirt, Thermometer, Dumbbell, 
  Utensils, Phone, Gift, Coffee, Bus, HeartPulse,
  Plus, Minus 
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

export default function QuickAddPage() {
  const router = useRouter()
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])

  const categories = [
    { name: 'خانه', icon: Home, color: '#60a5fa' },
    { name: 'خوراک', icon: Utensils, color: '#fb923c' },
    { name: 'حمل‌ونقل', icon: Bus, color: '#a78bfa' },
    { name: 'بهداشتی', icon: HeartPulse, color: '#f472b6' },
    { name: 'لباس', icon: Shirt, color: '#818cf8' },
    { name: 'تفریح', icon: Cat, color: '#fbbf24' },
    { name: 'کافی‌شاپ', icon: Coffee, color: '#f59e0b' },
    { name: 'هدیه', icon: Gift, color: '#f43f5e' },
    { name: 'ورزش', icon: Dumbbell, color: '#34d399' },
    { name: 'بیماری', icon: Thermometer, color: '#ef4444' },
    { name: 'تلفن', icon: Phone, color: '#22d3ee' },
    { name: 'ماشین', icon: Car, color: '#94a3b8' },
  ]

  // آپدیت نمودار
  const updateChart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('transactions')
      .select('amount, categories(name)')
      .eq('user_id', user.id)

    const summary: Record<string, number> = {}
    data?.forEach(t => {
      const name = t.categories?.name || 'متفرقه'
      summary[name] = (summary[name] || 0) + Number(t.amount)
    })

    const chartArray = Object.entries(summary).map(([name, value]) => ({
      name,
      value
    }))

    setChartData(chartArray)
  }

  useEffect(() => {
    updateChart()
    const interval = setInterval(updateChart, 5000) // هر ۵ ثانیه آپدیت
    return () => clearInterval(interval)
  }, [])

  const handleCategoryClick = (name: string) => {
    router.push(`/add-expense?category=${encodeURIComponent(name)}&type=expense`)
    setTimeout(updateChart, 1500)
  }

  const handleIncome = () => {
    router.push('/add-expense?type=income')
    setTimeout(updateChart, 1500)
  }

  const handleExpense = () => {
    router.push('/add-expense?type=expense')
    setTimeout(updateChart, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          اضافه کردن سریع
        </h1>

        {/* دکمه‌های + و - */}
        <div className="flex justify-center gap-16 mb-20">
          <button onClick={handleIncome} className="group relative w-36 h-36 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-emerald-500">
            <Plus size={80} />
            <span className="absolute -bottom-12 text-emerald-400 text-2xl font-bold opacity-0 group-hover:opacity-100 transition">درآمد</span>
          </button>
          <button onClick={handleExpense} className="group relative w-36 h-36 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-red-500">
            <Minus size={80} />
            <span className="absolute -bottom-12 text-red-400 text-2xl font-bold opacity-0 group-hover:opacity-100 transition">هزینه</span>
          </button>
        </div>

        {/* دایره آیکون‌ها + نمودار زنده */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {/* نمودار زنده وسط */}
          <div className="absolute w-80 h-80 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={150}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categories.find(c => c.name === entry.name)?.color || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toLocaleString()} تومان`}
                  contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* آیکون‌های دور دایره */}
          <div className="absolute inset-0">
            {categories.map((cat, index) => {
              const angle = (index * 360) / categories.length - 90
              const radius = 280
              const x = Math.cos((angle * Math.PI) / 180) * radius
              const y = Math.sin((angle * Math.PI) / 180) * radius

              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{
                    transform: `translate(calc(50% + ${x}px), calc(50% + ${y}px))`
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-800/80 border-4 border-gray-700 rounded-full flex items-center justify-center shadow-2xl hover:scale-125 hover:z-20 transition-all duration-300 group ring-4 ring-gray-800 hover:ring-blue-500"
                >
                  <cat.icon size={40} className={cat.color.replace('text-', '')} />
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-medium opacity-0 group-hover:opacity-100 bg-gray-800 px-3 py-1 rounded-lg whitespace-nowrap transition">
                    {cat.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-center mt-32 text-gray-400 text-xl">
          روی آیکون بزن تا هزینه‌ش رو سریع اضافه کنی!
        </p>
      </div>
    </div>
  )
}