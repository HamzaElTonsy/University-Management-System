'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function CoursesPage() {

  const [courses, setCourses] = useState([])
  const [requests, setRequests] = useState([])

  const [search, setSearch] = useState('')

  const [departmentFilter, setDepartmentFilter] =
    useState('All')

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
    users!fk_courses_professor (
      full_name
    )
  `)
    if (error) {
      console.log(error)
      return
    }

    setCourses(data)
  }

  // FETCH REQUESTS

  async function fetchRequests() {

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

    const { data: student } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!student) return

    const alreadyRequested = requests.find(
      (req) => req.course_id === courseId
    )

    if (alreadyRequested) {
      alert('Request already submitted')
      return
    }

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

    alert('Enrollment request submitted')

    fetchRequests()
  }

  // REQUEST STATUS

  function hasRequest(courseId) {

    return requests.find(
      (req) => req.course_id === courseId
    )
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 ml-64">

        {/* TOPBAR */}

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Course Catalog
          </h1>

          <div className="w-12 h-12 rounded-full bg-slate-300"></div>

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
            className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-6 text-black"
          />

          {/* FILTER */}

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-10 text-black"
          >

            <option value="All">
              All Departments
            </option>

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

          </select>

          {/* COURSES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {courses

              .filter((course) => {

                const matchesSearch =

                  course.course_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  course.course_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  course.users?.full_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                const matchesDepartment =

                  departmentFilter === 'All'

                  ||

                  course.department === departmentFilter

                return matchesSearch && matchesDepartment

              })

              .map((course) => {

                const requested = hasRequest(course.id)

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
                          Instructor: {course.users?.full_name}
                        </p>

                        <p className="text-gray-500 mt-2">
                          Department: {course.department}
                        </p>

                      </div>

                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                        Course
                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-8">

                      {!requested ? (

                        <button
                          onClick={() => requestCourse(course.id)}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-2xl text-lg font-semibold shadow"
                        >
                          Request Enrollment
                        </button>

                      ) : (

                        <div className="bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-semibold inline-block">
                          Request Submitted
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