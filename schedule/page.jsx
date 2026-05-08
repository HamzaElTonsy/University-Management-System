'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function SchedulePage() {

  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchSchedule()
  }, [])

  async function fetchSchedule() {

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

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          course_code,
          course_name,
          day,
          start_time,
          end_time,
          room,
          users (
            full_name
          )
        )
      `)
      .eq('student_id', student.id)

    if (error) {
      console.log(error)
      return
    }

    setCourses(data)
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 ml-64">

        <div className="bg-blue-700 h-20 flex items-center px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Weekly Schedule
          </h1>

        </div>

        <div className="p-10">

          <div className="grid gap-6">

            {courses.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg p-8"
              >

                <h2 className="text-3xl font-bold text-slate-800">
                  {item.courses?.course_code}
                </h2>

                <p className="text-xl text-gray-700 mt-3">
                  {item.courses?.course_name}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-6">

                  <div>

                    <p className="text-gray-500">
                      Instructor
                    </p>

                    <p className="font-semibold text-lg">
                      {item.courses?.users?.full_name}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Day
                    </p>

                    <p className="font-semibold text-lg">
                      {item.courses?.day}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Time
                    </p>

                    <p className="font-semibold text-lg">
                      {item.courses?.start_time} - {item.courses?.end_time}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Room
                    </p>

                    <p className="font-semibold text-lg">
                      {item.courses?.room}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}