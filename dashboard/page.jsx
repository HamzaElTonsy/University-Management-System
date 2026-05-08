'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function HomePage() {

  const [gpa, setGpa] = useState(0)
  const [registeredCourses, setRegisteredCourses] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)

  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function logout() {

    await supabase.auth.signOut()

    window.location.href = '/login'
  }

  async function fetchDashboardData() {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: student } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!student) return

    setUserName(student.full_name)
    setRole(student.role)

    // GPA

    const { data: gradesData } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', student.id)

    if (gradesData && gradesData.length > 0) {

      const total = gradesData.reduce(
        (sum, item) => sum + Number(item.gpa),
        0
      )

      const average = (
        total / gradesData.length
      ).toFixed(2)

      setGpa(average)

    } else {

      setGpa(0)
    }

    // ENROLLMENTS

    const { data: enrollmentsData } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', student.id)

    setRegisteredCourses(
      enrollmentsData?.length || 0
    )

    // PENDING

    const { data: pendingData } = await supabase
      .from('enrollment_requests')
      .select('*')
      .eq('student_id', student.id)
      .eq('status', 'Pending')

    setPendingRequests(
      pendingData?.length || 0
    )
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-64 bg-slate-900 text-white flex flex-col">

        <div className="bg-blue-700 p-6 text-3xl font-bold">
          ASUENG
        </div>

        <div className="flex flex-col items-center py-10 border-b border-slate-700">

          <div className="w-24 h-24 rounded-full bg-slate-500 mb-4"></div>

          <h2 className="text-center text-lg font-semibold px-4">
            {userName}
          </h2>

          <p className="text-slate-400 mt-2 capitalize">
            {role}
          </p>

        </div>

        <div className="flex flex-col mt-6">

          <button className="text-left px-8 py-4 bg-blue-700">
            Dashboard
          </button>

          <Link
            href="/courses"
            className="px-8 py-4 hover:bg-slate-800 transition"
          >
            Course Catalog
          </Link>

          <Link
            href="/my-courses"
            className="px-8 py-4 hover:bg-slate-800 transition"
          >
            My Courses
          </Link>

          <Link
            href="/materials"
            className="px-8 py-4 hover:bg-slate-800 transition"
          >
            Materials
          </Link>

          <Link
            href="/gpa"
            className="px-8 py-4 hover:bg-slate-800 transition"
          >
            GPA
          </Link>

          <Link
            href="/schedule"
            className="px-8 py-4 hover:bg-slate-800 transition"
          >
            Schedule
          </Link>

          {role === 'admin' && (

            <Link
              href="/admin/requests"
              className="px-8 py-4 hover:bg-slate-800 transition"
            >
              Admin
            </Link>

          )}

          {role === 'professor' && (

            <Link
              href="/professor"
              className="px-8 py-4 hover:bg-slate-800 transition"
            >
              Professor
            </Link>

          )}

          <button
            onClick={logout}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1">

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Ain Shams University SIS
          </h1>

          <div className="w-12 h-12 rounded-full bg-slate-300"></div>

        </div>

        <div className="p-10">

          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-3xl p-10 shadow-xl mb-10">

            <h2 className="text-5xl font-bold mb-4">
              Welcome Back
            </h2>

            <p className="text-xl">
              Welcome to Ain Shams University SIS
            </p>

          </div>

          {/* QUICK ACTIONS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            <Link
              href="/courses"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition"
            >

              <div className="text-5xl mb-5">
                📚
              </div>

              <h3 className="text-3xl font-bold text-slate-800">
                Courses
              </h3>

              <p className="text-gray-600 mt-4">
                Browse and request enrollment
              </p>

            </Link>

            <Link
              href="/materials"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition"
            >

              <div className="text-5xl mb-5">
                📄
              </div>

              <h3 className="text-3xl font-bold text-slate-800">
                Materials
              </h3>

              <p className="text-gray-600 mt-4">
                View lectures and announcements
              </p>

            </Link>

            <Link
              href="/gpa"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition"
            >

              <div className="text-5xl mb-5">
                🎓
              </div>

              <h3 className="text-3xl font-bold text-slate-800">
                GPA
              </h3>

              <p className="text-gray-600 mt-4">
                Check academic performance
              </p>

            </Link>

            <Link
              href="/schedule"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition"
            >

              <div className="text-5xl mb-5">
                🗓️
              </div>

              <h3 className="text-3xl font-bold text-slate-800">
                Schedule
              </h3>

              <p className="text-gray-600 mt-4">
                View weekly schedule
              </p>

            </Link>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h3 className="text-gray-500 text-lg">
                Current GPA
              </h3>

              <p className="text-5xl font-bold text-blue-700 mt-4">
                {gpa}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h3 className="text-gray-500 text-lg">
                Registered Courses
              </h3>

              <p className="text-5xl font-bold text-green-700 mt-4">
                {registeredCourses}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h3 className="text-gray-500 text-lg">
                Pending Requests
              </h3>

              <p className="text-5xl font-bold text-yellow-600 mt-4">
                {pendingRequests}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}