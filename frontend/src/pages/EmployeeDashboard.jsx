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
      navigate('/') // not logged in, kick back to sign in
      return
    }
    const currentUser = JSON.parse(stored)
    setUser(currentUser)

    api.get(`/attendance?userId=${currentUser.id}`).then((res) => setAttendance(res.data))
    api.get(`/leaveRequests?userId=${currentUser.id}`).then((res) => setLeaveRequests(res.data))
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  if (!user) return null // avoid flashing content before redirect check finishes

  const recentAttendance = attendance.slice(-3).reverse()
  const pendingLeave = leaveRequests.filter((l) => l.status === 'Pending')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.fullName}</h1>
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
          <p>{attendance.length} days logged this month</p>
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
              <li key={a.id}>
                <span>{a.date}</span>
                <span className={`status-badge status-${a.status.toLowerCase()}`}>{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default EmployeeDashboard