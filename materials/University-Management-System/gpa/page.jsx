'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function GPAPage() {

  const [grades, setGrades] = useState([])

  useEffect(() => {
    fetchGrades()
  }, [])

  async function fetchGrades() {

    // GET LOGGED-IN USER

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // GET STUDENT RECORD

    const { data: student, error: studentError } =
      await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single()

    if (studentError) {
      console.log(studentError)
      return
    }

    // GET ONLY THIS STUDENT'S GRADES

    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        courses (
          course_code,
          course_name
        )
      `)
      .eq('student_id', student.id)

    if (error) {
      console.log(error)
      return
    }

    setGrades(data)
  }

  function calculateGPA() {

    if (grades.length === 0) return 0

    const total = grades.reduce(
      (sum, item) => sum + Number(item.gpa),
      0
    )

    return (total / grades.length).toFixed(2)
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 ml-64">

        {/* TOPBAR */}

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            GPA Dashboard
          </h1>

          <div className="w-12 h-12 rounded-full bg-slate-300"></div>

        </div>

        {/* CONTENT */}

        <div className="p-10">

          {/* GPA CARD */}

          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-3xl p-10 shadow-xl mb-12">

            <p className="text-2xl mb-4">
              Current GPA
            </p>

            <h2 className="text-7xl font-bold">
              {calculateGPA()}
            </h2>

          </div>

          {/* COURSE GRADES */}

          <div>

            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Course Grades
            </h2>

            <div className="grid gap-6">

              {grades.map((grade) => (

                <div
                  key={grade.id}
                  className="bg-white rounded-3xl shadow-lg p-8 flex justify-between items-center"
                >

                  <div>

                    <h3 className="text-2xl font-bold text-slate-800">
                      {grade.courses?.course_name}
                    </h3>

                    <p className="text-gray-500 mt-2 text-lg">
                      {grade.courses?.course_code}
                    </p>

                    <p className="text-gray-600 mt-3 text-lg">
                      Academic Performance
                    </p>

                  </div>

                  <div className="flex items-center gap-6">

                    <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-2xl font-bold text-xl">
                      {grade.grade}
                    </div>

                    <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-bold text-xl">
                      GPA {grade.gpa}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}