// 'use client'

// import { supabase } from './lib/supabase'
// import { useEffect, useState } from 'react'

// export default function Home() {
//   const [expenses, setExpenses] = useState<any[]>([])
//   const [amount, setAmount] = useState('')
//   const [description, setDescription] = useState('')
//   const [category, setCategory] = useState('')
//   const [type, setType] = useState('expense')

//   useEffect(() => {
//     fetchExpenses()
//   }, [])

//   async function fetchExpenses() {
//     const { data } = await supabase
//       .from('transactions')
//       .select('*, categories(name), sources(name)')
//       .order('date', { ascending: false })
//     setExpenses(data || [])
//   }

// async function addExpense(e: React.FormEvent) {
//   e.preventDefault()
//   if (!amount || !description) return

//   const { error } = await supabase.from('transactions').insert({
//     amount: parseFloat(amount),
//     description,
//     type,                         // این خط رو حتماً داشته باشه
//     date: new Date().toISOString().split('T')[0]
//   })

//   if (error) {
//     console.error(error)
//     alert('خطا: ' + error.message)
//   } else {
//     setAmount('')
//     setDescription('')
//     setCategory('')
//     fetchExpenses()
//   }
// }
//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-10 text-center">حسابداری شخصی من</h1>

//         {/* فرم */}
//         <form onSubmit={addExpense} className="bg-gray-800 shadow--2xl rounded-2xl p-8 mb-10 border border-gray-700">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="number"
//               placeholder="مبلغ (تومان)"
//               value={amount}
//               onChange={e => setAmount(e.target.value)}
//               className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-4 rounded-xl text-lg focus:outline-none focus:border-blue-500 transition"
//               required
//             />
//             <input
//               type="text"
//               placeholder="توضیح (مثلاً خرید نون)"
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//               className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-4 rounded-xl text-lg focus:outline-none focus:border-blue-500 transition"
//               required
//             />
//             <select 
//               value={type} 
//               onChange={e => setType(e.target.value)}
//               className="bg-gray-700 border border-gray-600 text-white p-4 rounded-xl text-lg focus:outline-none focus:border-blue-500"
//             >
//               <option value="expense" className="bg-gray-700">هزینه</option>
//               <option value="income" className="bg-gray-700">درآمد</option>
//             </select>
//             <input
//               type="text"
//               placeholder="دسته‌بندی (مثلاً خانه، خوراک)"
//               value={category}
//               onChange={e => setCategory(e.target.value)}
//               className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-4 rounded-xl text-lg focus:outline-none focus:border-blue-500 transition"
//             />
//           </div>

//           <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xl transition shadow-lg">
//             ثبت کن
//           </button>
//           <div className="text-yellow-400 text-sm mt-2">اگر خطایی بود اینجا نشون میده</div>
//         </form>

//         {/* لیست هزینه‌ها */}
//         <div className="space-y-4">
//           {expenses.length === 0 ? (
//             <p className="text-center text-gray-400 text-xl">هنوز هیچ هزینه‌ای ثبت نکردی</p>
//           ) : (
//             expenses.map(exp => (
//               <div 
//                 key={exp.id} 
//                 className={`p-6 rounded-2xl shadow-xl border ${
//                   exp.type === 'income' 
//                     ? 'bg-emerald-900/50 border-emerald-700' 
//                     : 'bg-red-900/50 border-red-700'
//                 }`}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <strong className="text-2xl">{exp.description}</strong>
//                     {exp.categories && 
//                       <span className="mr-3 text-gray-300 text-lg"> — {exp.categories.name}</span>
//                     }
//                   </div>
//                   <div className={`text-2xl font-bold ${
//                     exp.type === 'income' ? 'text-emerald-400' : 'text-red-400'
//                   }`}>
//                     {exp.type === 'income' ? '+' : '-'} {exp.amount.toLocaleString()} تومان
//                   </div>
//                 </div>
//                 <div className="text-gray-400 mt-2">
//                   {new Date(exp.date).toLocaleDateString('fa-IR')}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([])

  async function loadTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: false })
    setTransactions(data || [])
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('مطمئنی؟')) return
    await supabase.from('transactions').delete().eq('id', id)
    loadTransactions()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">حسابداری شخصی من</h1>
        <ExpenseForm onAdd={loadTransactions} />
        <ExpenseList transactions={transactions} onDelete={handleDelete} onUpdate={loadTransactions} />
      </div>
    </div>
  )
}