'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'خانه', href: '/', icon: Home },
    { name: 'داشبورد و نمودار', href: '/dashboard', icon: PieChart },
  ]

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-6 border-l border-gray-700">
      <h1 className="text-2xl font-bold mb-10 text-center">حسابداری من</h1>
      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon
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