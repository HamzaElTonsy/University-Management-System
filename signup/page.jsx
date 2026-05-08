'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function SignupPage() {

  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [role, setRole] = useState('student')

  const [department, setDepartment] = useState(
    'Computer Engineering'
  )

  async function handleSignup(e) {

  e.preventDefault()

  // SIGN UP AUTH

  const {
    data,
    error,
  } = await supabase.auth.signUp({

    email,
    password,

  })

  if (error) {

    alert(error.message)

    return
  }

  // CHECK USER

  if (!data.user) {

    alert('Signup failed')

    return
  }

  // LEVELS

  let academicLevel = 'Level 1'

  if (role === 'professor') {
    academicLevel = 'Faculty'
  }

  if (role === 'admin') {
    academicLevel = 'Administration'
  }

  // INSERT USER

  const { error: insertError } =
    await supabase
      .from('users')
      .insert([
        {
          auth_id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role,
          department: department,
          academic_level: academicLevel,
        },
      ])

  if (insertError) {

    console.log(insertError)

    alert(insertError.message)

    return
  }

  alert('Account Created Successfully')

  router.push('/login')
}

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-10">

      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h1 className="text-5xl font-bold text-center mb-10 text-blue-700">
          Create Account
        </h1>

        {/* FULL NAME */}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-5 text-lg text-black placeholder-gray-400"
        />

        {/* EMAIL */}

        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-5 text-lg text-black placeholder-gray-400"
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-5 text-lg text-black placeholder-gray-400"
        />

        {/* ROLE */}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-5 text-lg text-black"
        >

          <option value="student">
            Student
          </option>

          <option value="professor">
            Professor
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        {/* DEPARTMENT */}

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border-2 border-gray-300 p-5 rounded-2xl mb-8 text-lg text-black"
        >

          <option value="Computer Engineering">
            Computer Engineering
          </option>

          <option value="Electrical Engineering">
            Electrical Engineering
          </option>

          <option value="Architecture Engineering">
            Architecture Engineering
          </option>

          <option value="Chemical Engineering">
            Chemical Engineering
          </option>

          <option value="Energy Engineering">
            Energy Engineering
          </option>

          <option value="Mechanical Engineering">
            Mechanical Engineering
          </option>

        </select>

        {/* BUTTON */}

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-bold text-2xl"
        >
          Sign Up
        </button>

        {/* LOGIN LINK */}

        <p className="text-center mt-8 text-gray-600">

          Already have an account?

          <a
            href="/login"
            className="text-blue-700 font-bold ml-2"
          >
            Login
          </a>

        </p>

      </form>

    </div>

  )
}