'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {

  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [])

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-3xl font-bold">

      Loading...

    </div>

  )
}