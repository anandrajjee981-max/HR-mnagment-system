import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Dashboard.css'

function EmployeeDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }

    const currentUser = JSON.parse(stored)
    setUser(currentUser)

    Promise.all([
      api.get('/attend/getattend'),
      api.get('/leave/get'),
    ])
      .then(([attendanceRes, leaveRes]) => {
        setAttendance(attendanceRes.data.attendance || [])
        setLeaveRequests(leaveRes.data.check || [])
      })
      .catch(() => {
        setAttendance([])
        setLeaveRequests([])
      })
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/')
  }

  if (!user) return null

  const recentAttendance = attendance.slice(0, 3)
  const pendingLeave = leaveRequests.filter((l) => String(l.status).toLowerCase() === 'pending')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="card-grid">
        <Link to="/profile" className="dashboard-card">
          <h2>Profile</h2>
          <p>View and edit your details</p>
        </Link>

        <Link to="/attendance" className="dashboard-card">
          <h2>Attendance</h2>
          <p>{attendance.length} records available</p>
        </Link>

        <Link to="/leave" className="dashboard-card">
          <h2>Leave requests</h2>
          <p>{pendingLeave.length} pending</p>
        </Link>
      </div>

      <section className="activity-section">
        <h2>Recent activity</h2>
        {recentAttendance.length === 0 ? (
          <p className="empty-state">No attendance records yet</p>
        ) : (
          <ul className="activity-list">
            {recentAttendance.map((a) => (
              <li key={a._id || a.id}>
                <span>{a.date}</span>
                <span className={`status-badge status-${(a.status || 'inside').toLowerCase()}`}>
                  {a.status || 'INSIDE'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default EmployeeDashboard