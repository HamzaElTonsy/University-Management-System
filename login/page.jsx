'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {

    e.preventDefault()

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email,
        password,

      })

    if (error) {
      console.log(error)
      alert(error.message)
      return
    }

    if (data.user) {
      router.push('/dashboard')
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-10">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h1 className="text-5xl font-bold text-center mb-10 text-blue-700">
          ASUENG SIS
        </h1>

        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-5 text-lg text-black placeholder-gray-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-8 text-lg text-black placeholder-gray-400"
        />

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-bold text-2xl"
        >
          Login
        </button>

        <p className="text-center mt-8 text-gray-600">

          Don’t have an account?

          <a
            href="/signup"
            className="text-blue-700 font-bold ml-2"
          >
            Sign Up
          </a>

        </p>

      </form>

    </div>

  )
}