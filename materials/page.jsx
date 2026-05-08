'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function MaterialsPage() {

  const [announcements, setAnnouncements] = useState([])
  const [lectures, setLectures] = useState([])
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {

    // GET LOGGED USER

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // GET STUDENT

    const { data: student } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!student) return

    // GET ENROLLED COURSES

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', student.id)

    if (!enrollments || enrollments.length === 0) return

    const courseIds = enrollments.map(
      (item) => item.course_id
    )

    // FETCH ANNOUNCEMENTS

    const { data: announcementsData } = await supabase
      .from('announcements')
      .select(`
        *,
        courses (
          course_code,
          course_name
        )
      `)
      .in('course_id', courseIds)

    // FETCH LECTURES

    const { data: lecturesData } = await supabase
      .from('lectures')
      .select(`
        *,
        courses (
          course_code,
          course_name
        )
      `)
      .in('course_id', courseIds)

    // FETCH ASSIGNMENTS

    const { data: assignmentsData } = await supabase
      .from('assignments')
      .select(`
        *,
        courses (
          course_code,
          course_name
        )
      `)
      .in('course_id', courseIds)

    setAnnouncements(announcementsData || [])
    setLectures(lecturesData || [])
    setAssignments(assignmentsData || [])
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 ml-64">

        {/* TOPBAR */}

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Course Materials
          </h1>

          <div className="w-12 h-12 rounded-full bg-slate-300"></div>

        </div>

        {/* CONTENT */}

        <div className="p-10">

          {/* INFO */}

          <div className="bg-cyan-700 text-white p-5 rounded-2xl shadow mb-10">
            View announcements, lectures, and assignments for your enrolled courses.
          </div>

          {/* ANNOUNCEMENTS */}

          <div className="mb-16">

            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Announcements
            </h2>

            <div className="grid gap-6">

              {announcements.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-2xl font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mt-4 text-lg">
                        {item.content}
                      </p>

                      <p className="text-blue-700 font-semibold mt-4">
                        {item.courses?.course_code} - {item.courses?.course_name}
                      </p>

                    </div>

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                      Announcement
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* LECTURES */}

          <div className="mb-16">

            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Lectures
            </h2>

            <div className="grid gap-6">

              {lectures.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-2xl font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mt-4 text-lg">
                        {item.description}
                      </p>

                      <p className="text-blue-700 font-semibold mt-4">
                        {item.courses?.course_code} - {item.courses?.course_name}
                      </p>

                    </div>

                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
                      Lecture
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ASSIGNMENTS */}

          <div>

            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Assignments
            </h2>

            <div className="grid gap-6">

              {assignments.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-2xl font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mt-4 text-lg">
                        {item.description}
                      </p>

                      <p className="text-blue-700 font-semibold mt-4">
                        {item.courses?.course_code} - {item.courses?.course_name}
                      </p>

                    </div>

                    <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold">
                      Assignment
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