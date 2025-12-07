// src/components/RequireAuth.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../app/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
    }

    checkUser()

    // نوع دقیق برای onAuthStateChange
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (!session) {
          router.push('/auth')
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [router])

  return <>{children}</>
}