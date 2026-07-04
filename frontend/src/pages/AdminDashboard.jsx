import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('employees') // employees | leave | attendance
  const [users, setUsers] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    if (currentUser.role !== 'admin') {
      navigate('/dashboard') // not an admin, kick them out
      return
    }
    setAdmin(currentUser)
    loadAll()
  }, [navigate])

  async function loadAll() {
    const [usersRes, leaveRes, attendanceRes] = await Promise.all([
      api.get('/users'),
      api.get('/leaveRequests'),
      api.get('/attendance'),
    ])
    setUsers(usersRes.data.filter((u) => u.role === 'employee'))
    setLeaveRequests(leaveRes.data)
    setAttendance(attendanceRes.data)
    setLoading(false)
  }

  function handleLogout() {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  async function handleLeaveDecision(requestId, status) {
    await api.patch(`/leaveRequests/${requestId}`, { status })
    setLeaveRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)))
  }

  function getUserName(userId) {
    return users.find((u) => u.id === userId)?.fullName || 'Unknown'
  }

  if (loading) return null

  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending')
  const decidedRequests = leaveRequests.filter((r) => r.status !== 'Pending')

  const filteredAttendance = selectedEmployeeId
    ? attendance.filter((a) => a.userId === selectedEmployeeId)
    : attendance

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin dashboard</h1>
          <p className="admin-subtitle">Welcome, {admin.fullName}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Employees</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{pendingRequests.length}</span>
          <span className="stat-label">Pending leave requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length}
          </span>
          <span className="stat-label">Checked in today</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'employees' ? 'tab active' : 'tab'} onClick={() => setTab('employees')}>
          Employees
        </button>
        <button className={tab === 'leave' ? 'tab active' : 'tab'} onClick={() => setTab('leave')}>
          Leave approvals
          {pendingRequests.length > 0 && <span className="tab-badge">{pendingRequests.length}</span>}
        </button>
        <button className={tab === 'attendance' ? 'tab active' : 'tab'} onClick={() => setTab('attendance')}>
          Attendance
        </button>
      </div>

      {tab === 'employees' && (
        <div className="admin-panel">
          {users.length === 0 ? (
            <p className="empty-state">No employees yet</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Job title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.employeeId}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.jobTitle || '—'}</td>
                    <td>
                      <button
                        className="link-btn"
                        onClick={() => {
                          setSelectedEmployeeId(u.id)
                          setTab('attendance')
                        }}
                      >
                        View attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'leave' && (
        <div className="admin-panel">
          <h2 className="panel-title">Pending requests</h2>
          {pendingRequests.length === 0 ? (
            <p className="empty-state">No pending leave requests</p>
          ) : (
            <ul className="leave-approval-list">
              {pendingRequests.map((r) => (
                <li key={r.id} className="leave-approval-card">
                  <div>
                    <p className="request-name">{getUserName(r.userId)}</p>
                    <p className="request-type">{r.leaveType} leave</p>
                    <p className="request-dates">
                      {r.startDate} → {r.endDate}
                    </p>
                    {r.remarks && <p className="request-remarks">"{r.remarks}"</p>}
                  </div>
                  <div className="approval-actions">
                    <button className="btn-approve" onClick={() => handleLeaveDecision(r.id, 'Approved')}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleLeaveDecision(r.id, 'Rejected')}>
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {decidedRequests.length > 0 && (
            <>
              <h2 className="panel-title">History</h2>
              <ul className="leave-approval-list">
                {decidedRequests.map((r) => (
                  <li key={r.id} className="leave-approval-card decided">
                    <div>
                      <p className="request-name">{getUserName(r.userId)}</p>
                      <p className="request-type">{r.leaveType} leave</p>
                      <p className="request-dates">
                        {r.startDate} → {r.endDate}
                      </p>
                    </div>
                    <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {tab === 'attendance' && (
        <div className="admin-panel">
          <div className="attendance-filter">
            <label htmlFor="empFilter">Filter by employee</label>
            <select
              id="empFilter"
              value={selectedEmployeeId || ''}
              onChange={(e) => setSelectedEmployeeId(e.target.value || null)}
            >
              <option value="">All employees</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
          </div>

          {filteredAttendance.length === 0 ? (
            <p className="empty-state">No attendance records</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((a) => (
                  <tr key={a.id}>
                    <td>{getUserName(a.userId)}</td>
                    <td>{a.date}</td>
                    <td>
                      <span className={`status-badge status-${a.status.toLowerCase().replace(' ', '-')}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.checkIn || '—'}</td>
                    <td>{a.checkOut || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard