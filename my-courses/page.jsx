'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function CoursesPage() {

  const [courses, setCourses] = useState([])
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCourses()
    fetchRequests()
  }, [])

  // FETCH COURSES

  async function fetchCourses() {

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        prerequisites (
          prerequisite_name
        )
      `)

    if (error) {
      console.log(error)
      return
    }

    setCourses(data)
  }

  // FETCH CURRENT STUDENT REQUESTS

  async function fetchRequests() {

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

    // GET ONLY THIS STUDENT REQUESTS

    const { data, error } = await supabase
      .from('enrollment_requests')
      .select('*')
      .eq('student_id', student.id)

    if (error) {
      console.log(error)
      return
    }

    setRequests(data)
  }

  // REQUEST COURSE

  async function requestCourse(courseId) {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login first')
      return
    }

    // GET STUDENT

    const { data: student } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!student) return

    // CHECK DUPLICATE

    const alreadyRequested = requests.find(
      (req) => req.course_id === courseId
    )

    if (alreadyRequested) {
      alert('Already Requested')
      return
    }

    // INSERT REQUEST

    const { error } = await supabase
      .from('enrollment_requests')
      .insert([
        {
          student_id: student.id,
          course_id: courseId,
          status: 'Pending',
        },
      ])

    if (error) {
      console.log(error)
      return
    }

    alert('Enrollment Request Sent')

    fetchRequests()
  }

  // REQUEST STATUS

  function getRequestStatus(courseId) {

    const request = requests.find(
      (req) => req.course_id === courseId
    )

    return request?.status
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 ml-64">

        {/* TOPBAR */}

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Student Portal
          </h1>

          <div className="flex items-center gap-6">

            <div className="bg-blue-600 px-4 py-2 rounded-xl">
              Courses
            </div>

            <div className="w-12 h-12 rounded-full bg-slate-300"></div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-10">

          {/* INFO */}

          <div className="bg-cyan-700 text-white p-5 rounded-2xl shadow mb-10">
            Browse available university courses and submit enrollment requests.
          </div>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search by course name, code, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-8 text-black"
          />

          {/* COURSES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {courses

              .filter((course) => {

                if (search === '') {
                  return true
                }

                return (

                  course.course_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  course.course_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  course.instructor
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                )

              })

              .map((course) => {

                const status = getRequestStatus(course.id)

                return (

                  <div
                    key={course.id}
                    className="bg-white rounded-3xl shadow-lg p-8"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h2 className="text-3xl font-bold text-slate-800">
                          {course.course_code}
                        </h2>

                        <p className="text-xl mt-4 text-gray-700">
                          {course.course_name}
                        </p>

                        <p className="text-gray-500 mt-3">
                          Instructor: {course.instructor}
                        </p>

                        {/* PREREQUISITES */}

                        <div className="mt-5">

                          <p className="text-gray-500 text-sm mb-2">
                            Prerequisites
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {course.prerequisites?.map((item) => (

                              <span
                                key={item.id}
                                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-xl text-sm font-semibold"
                              >
                                {item.prerequisite_name}
                              </span>

                            ))}

                          </div>

                        </div>

                      </div>

                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                        Course
                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-8">

                      {!status && (

                        <button
                          onClick={() => requestCourse(course.id)}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-2xl text-lg font-semibold shadow"
                        >
                          Request Enrollment
                        </button>

                      )}

                      {status === 'Pending' && (

                        <div className="bg-yellow-400 text-black px-5 py-3 rounded-2xl font-bold inline-block">
                          Pending Approval
                        </div>

                      )}

                      {status === 'Approved' && (

                        <div className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold inline-block">
                          Enrolled Successfully
                        </div>

                      )}

                      {status === 'Rejected' && (

                        <div className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold inline-block">
                          Request Rejected
                        </div>

                      )}

                    </div>

                  </div>

                )

              })}

          </div>

        </div>

      </div>

    </div>

  )
}