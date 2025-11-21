'use client'

import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('stock')
  const [quantity, setQuantity] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const router = useRouter()
const [prices, setPrices] = useState<any>({})

useEffect(() => {
  // قیمت‌ها رو هر 30 ثانیه آپدیت کن
  async function fetchPrices() {
    try {
      // قیمت دلار و طلا از تترلند
      const tetherland = await fetch('https://api.tetherland.com/currencies')
      const tlData = await tetherland.json()

      // قیمت ارزهای دیجیتال از رمزینکس
      const ramsinex = await fetch('https://publicapi.ramsinex.com/v1/market/tickers')
      const rmData = await ramsinex.json()

      setPrices({
        dollar: Number(tlData.data.currencies.USDT.price.replace(/,/g, '')),
        gold18k: Number(tlData.data.currencies.GOLD18K.price.replace(/,/g, '')),
        btc: rmData.data.find((t: any) => t.symbol === 'BTCIRT')?.last_price || 0,
        eth: rmData.data.find((t: any) => t.symbol === 'ETHIRT')?.last_price || 0,
      })
    } catch (err) {
      console.log('خطا در دریافت قیمت')
    }
  }

  fetchPrices()
  const interval = setInterval(fetchPrices, 30000) // هر ۳۰ ثانیه
  return () => clearInterval(interval)
}, [])
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('buy_date', { ascending: false })
      setInvestments(data || [])
    }
    load()
  }, [router])

async function addInvestment(e: React.FormEvent) {
  e.preventDefault()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // تشخیص خودکار symbol
  let symbol = null
  if (name.includes('بیت‌کوین') || name.includes('BTC')) symbol = 'BTC'
  else if (name.includes('اتریوم') || name.includes('ETH')) symbol = 'ETH'
  else if (name.includes('طلا') || type === 'gold') symbol = 'GOLD'
  else if (name.includes('دلار') || name.includes('USDT')) symbol = 'DOLLAR'

  await supabase.from('investments').insert({
    user_id: user.id,
    name,
    type,
    quantity: parseFloat(quantity),
    buy_price: parseFloat(buyPrice),
    current_price: parseFloat(currentPrice) || null,
    symbol, // این خط جدیده!
  })

  // پاک کردن فرم و رفرش
  setName(''); setQuantity(''); setBuyPrice(''); setCurrentPrice('')
  window.location.reload()
}
  // محاسبه سود/زیان کل
  const totalInvested = investments.reduce((sum, i) => sum + (i.buy_price * i.quantity), 0)
  const totalCurrent = investments.reduce((sum, i) => sum + ((i.current_price || i.buy_price) * i.quantity), 0)
  const totalProfit = totalCurrent - totalInvested
  const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="  portefeuille text-4xl font-bold mb-8 text-center">سرمایه‌گذاری‌های من</h1>

        {/* خلاصه سود و زیان */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <p className="text-gray-400">سرمایه اولیه</p>
            <p className="text-2xl font-bold">{totalInvested.toLocaleString()} تومان</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <p className="text-gray-400">ارزش فعلی</p>
            <p className="text-2xl font-bold text-emerald-400">{totalCurrent.toLocaleString()} تومان</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <p className="text-gray-400">سود/زیان</p>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalProfit.toLocaleString()} تومان
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <p className="text-gray-400">درصد تغییر</p>
            <p className={`text-3xl font-bold ${profitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {profitPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* فرم اضافه کردن */}
        <form onSubmit={addInvestment} className="bg-gray-800 p-8 rounded-2xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input placeholder="نام (مثلاً بیت‌کوین)" value={name} onChange={e => setName(e.target.value)} required className="bg-gray-700 p-4 rounded-lg" />
            <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-700 p-4 rounded-lg">
              <option value="stock">سهام</option>
              <option value="crypto">ارز دیجیتال</option>
              <option value="gold">طلا/سکه</option>
              <option value="fund">صندوق</option>
              <option value="other">سایر</option>
            </select>
            <input type="number" step="any" placeholder="تعداد" value={quantity} onChange={e => setQuantity(e.target.value)} required className="bg-gray-700 p-4 rounded-lg" />
            <input type="number" placeholder="قیمت خرید (تومان)" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} required className="bg-gray-700 p-4 rounded-lg" />
            <input type="number" placeholder="قیمت فعلی (اختیاری)" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} className="bg-gray-700 p-4 rounded-lg" />
          </div>
          <button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-xl">
            افزودن سرمایه‌گذاری
          </button>
        </form>

        {/* لیست سرمایه‌گذاری‌ها */}
        <div className="grid gap-4">
          {investments.map((inv) => {
    // محاسبه قیمت فعلی (زنده یا دستی)
    const getLivePrice = () => {
      if (inv.symbol === 'BTC') return prices.btc || inv.buy_price
      if (inv.symbol === 'ETH') return prices.eth || inv.buy_price
      if (inv.symbol === 'GOLD') return prices.gold18k || inv.buy_price
      if (inv.symbol === 'DOLLAR') return prices.dollar || inv.buy_price
      return inv.current_price || inv.buy_price
    }

    const livePrice = getLivePrice()
    const currentValue = livePrice * inv.quantity
    const profitPercent = ((livePrice - inv.buy_price) / inv.buy_price) * 100

    return (
      <div key={inv.id} className="bg-gray-800 p-6 rounded-2xl flex justify-between items-center shadow-lg">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {inv.name}
            {inv.symbol && (
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                {inv.symbol}
              </span>
            )}
          </h3>
          <p className="text-gray-400">
            {inv.type === 'crypto' ? 'ارز دیجیتال' : 
             inv.type === 'gold' ? 'طلا و سکه' : 
             inv.type === 'stock' ? 'سهام' : 'سایر'}
          </p>
          <p className="text-sm text-gray-500">
            خرید: {new Date(inv.buy_date).toLocaleDateString('fa-IR')}
          </p>
        </div>

        <div className="text-right space-y-2">
          <p className="text-lg">تعداد: <span className="font-bold">{inv.quantity}</span></p>
          
          <p className="text-emerald-400 text-xl font-bold">
            ارزش فعلی: {currentValue.toLocaleString()} تومان
          </p>

          <p className={`text-2xl font-bold ${profitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
          </p>
        </div>
      </div>
    )
  })}
        </div>
      </div>
    </div>
  )
}