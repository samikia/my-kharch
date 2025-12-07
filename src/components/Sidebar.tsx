'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, DollarSign, Rabbit } from 'lucide-react'  // آیکون جدید اضافه شد
import { supabase } from '../app/lib/supabase'
import { run } from 'node:test'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'خانه', href: '/', icon: Home },
    { name: 'داشبورد و نمودار', href: '/dashboard', icon: PieChart },
    { name: 'سرمایه‌گذاری‌ها', href: '/investments', icon: DollarSign }, // آیکون اضافه شد
  {name:"اضافه کردن سریع",href:"/quick-add",icon: Rabbit }
    // اگه بعداً بخوای یکی دیگه اضافه کنی هم حتماً icon داشته باشه
  ]

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-6 border-l border-gray-700">
      <h1 className="text-2xl font-bold mb-10 text-center">حسابداری من</h1>

      {/* پروفایل و خروج */}
      <div className="flex items-center gap-4 mb-8">
        <a href="/profile" className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-xl transition">
          پروفایل من
        </a>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/auth'
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition"
        >
          خروج
        </button>
      </div>

      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon // حالا مطمئنیم که همیشه وجود داره
          const isActive = pathname === link.href

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Icon size={22} />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}