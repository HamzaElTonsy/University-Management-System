'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function ProfessorPage() {

  const router = useRouter()

  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])

  const [selectedCourse, setSelectedCourse] =
    useState('')

  const [selectedStudent, setSelectedStudent] =
    useState('')

  const [gradeLetter, setGradeLetter] =
    useState('A')

  const [gpaValue, setGpaValue] =
    useState('4.0')

  const [announcementTitle, setAnnouncementTitle] =
    useState('')

  const [announcementContent, setAnnouncementContent] =
    useState('')

  const [lectureTitle, setLectureTitle] =
    useState('')

  const [lectureDescription, setLectureDescription] =
    useState('')

  const [assignmentTitle, setAssignmentTitle] =
    useState('')

  const [assignmentDescription, setAssignmentDescription] =
    useState('')

  useEffect(() => {
  checkProfessor()
  }, [])
    useEffect(() => {

  const gradeMap = {
    'A': '4.0',
    'A-': '3.7',
    'B+': '3.5',
    'B': '3.0',
    'C': '2.0',
    'D': '1.0',
    'F': '0.0',
  }

  setGpaValue(
    gradeMap[gradeLetter]
  )

}, [gradeLetter])

  // CHECK ACCESS

  async function checkProfessor() {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!data || data.role !== 'professor') {

      router.push('/dashboard')

      return
    }

    fetchProfessorCourses()
    fetchStudents()
  }

  // FETCH COURSES

  async function fetchProfessorCourses() {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: professor } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!professor) return
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq(
        'professor_id',
        Number(professor.id)
      )
    if (error) {
      console.log(error)
      return
    }

    setCourses(data)
  }

  // FETCH STUDENTS

  async function fetchStudents() {

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')

    if (error) {
      console.log(error)
      return
    }

    setStudents(data)
  }

  // ADD ANNOUNCEMENT

  async function addAnnouncement() {

  if (
    !selectedCourse ||
    !announcementTitle ||
    !announcementContent
  ) {
    alert('Fill all fields')
    return
  }

  const { error } = await supabase
    .from('announcements')
    .insert([
      {
        title: announcementTitle,
        content: announcementContent,
        course_id: selectedCourse,
      },
    ])

  if (error) {

    console.log(error)

    alert(error.message)

    return
  }

  alert('Announcement uploaded')
}

  // ADD LECTURE

  async function addLecture() {

  if (
    !selectedCourse ||
    !lectureTitle ||
    !lectureDescription
  ) {
    alert('Fill all fields')
    return
  }

  const { error } = await supabase
    .from('lectures')
    .insert([
      {
        title: lectureTitle,
        description: lectureDescription,
        course_id: selectedCourse,
      },
    ])

  if (error) {

    console.log(error)

    alert(error.message)

    return
  }

  alert('Lecture uploaded')
}

  // ADD ASSIGNMENT

  async function addAssignment() {

  if (
    !selectedCourse ||
    !assignmentTitle ||
    !assignmentDescription
  ) {
    alert('Fill all fields')
    return
  }

  const { error } = await supabase
    .from('assignments')
    .insert([
      {
        title: assignmentTitle,
        description: assignmentDescription,
        course_id: selectedCourse,
      },
    ])

  if (error) {

    console.log(error)

    alert(error.message)

    return
  }

  alert('Assignment uploaded')
}

  // UPLOAD GRADE

  async function uploadGrade() {

  if (!selectedStudent || !selectedCourse) {

    alert('Select student and course')

    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    alert('Professor not found')
    return
  }

  const { data: professor } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!professor) {
    alert('Professor not found')
    return
  }

  const { error } = await supabase
    .from('grades')
    .insert([
      {
        student_id: selectedStudent,
        course_id: selectedCourse,
        professor_id: professor.id,
        grade: gradeLetter,
        gpa: Number(gpaValue),
      },
    ])

  if (error) {

    console.log(error)

    alert(error.message)

    return
  }

  alert('Grade uploaded successfully')
}

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 ml-64">

        {/* TOPBAR */}

        <div className="bg-blue-700 h-20 flex items-center justify-between px-10 text-white shadow-lg">

          <h1 className="text-3xl font-bold">
            Professor Dashboard
          </h1>

          <div className="w-12 h-12 rounded-full bg-slate-300"></div>

        </div>

        {/* CONTENT */}

        <div className="p-10">

          {/* COURSE */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

            <h2 className="text-3xl font-bold mb-6 text-slate-800">
              Select Course
            </h2>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 text-black"
            >

              <option value="">
                Choose Course
              </option>

              {courses.map((course) => (

                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.course_code} - {course.course_name}
                </option>

              ))}

            </select>

          </div>

          {/* ANNOUNCEMENT */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

            <h2 className="text-3xl font-bold mb-6">
              Upload Announcement
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            />

            <textarea
              placeholder="Content"
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black h-40"
            />

            <button
              onClick={addAnnouncement}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-2xl"
            >
              Upload Announcement
            </button>

          </div>

          {/* LECTURE */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

            <h2 className="text-3xl font-bold mb-6">
              Upload Lecture
            </h2>

            <input
              type="text"
              placeholder="Lecture Title"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            />

            <textarea
              placeholder="Lecture Description"
              value={lectureDescription}
              onChange={(e) => setLectureDescription(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black h-40"
            />

            <button
              onClick={addLecture}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-2xl"
            >
              Upload Lecture
            </button>

          </div>

          {/* ASSIGNMENT */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

            <h2 className="text-3xl font-bold mb-6">
              Upload Assignment
            </h2>

            <input
              type="text"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            />

            <textarea
              placeholder="Assignment Description"
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black h-40"
            />

            <button
              onClick={addAssignment}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded-2xl"
            >
              Upload Assignment
            </button>

          </div>

          {/* GRADES */}

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-6">
              Upload Grades
            </h2>

            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            >

              <option value="">
                Select Student
              </option>

              {students.map((student) => (

                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.full_name}
                </option>

              ))}

            </select>

            <select
              value={gradeLetter}
              onChange={(e) => setGradeLetter(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            >

              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>

            </select>

            <input
              type="number"
              step="0.1"
              placeholder="GPA Value"
              value={gpaValue}
              onChange={(e) => setGpaValue(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-300 mb-5 text-black"
            />

            <button
              onClick={uploadGrade}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-4 rounded-2xl"
            >
              Upload Grade
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}