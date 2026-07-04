import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('employees')
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
      navigate('/dashboard')
      return
    }

    setAdmin(currentUser)
    loadAll()
  }, [navigate])

  async function loadAll() {
    try {
      const [payrollRes, leaveRes, attendanceRes] = await Promise.all([
        api.get('/admin/payroll'),
        api.get('/admin/leavelist'),
        api.get('/admin/attendlist'),
      ])

      const employeeList = (payrollRes.data.payroll || []).filter((u) => u.role === 'employee')
      setUsers(employeeList)
      setLeaveRequests(leaveRes.data.leaves || [])
      setAttendance(attendanceRes.data.attendance || [])
    } catch (err) {
      setUsers([])
      setLeaveRequests([])
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/')
  }

  async function handleLeaveDecision(leaveId, status) {
    try {
      await api.patch(`/admin/${status === 'approved' ? 'approve' : 'reject'}/${leaveId}`)
      setLeaveRequests((prev) => prev.map((r) => (r._id === leaveId ? { ...r, status } : r)))
    } catch (err) {
      console.error('Leave update failed', err)
    }
  }

  function getUserName(userId) {
    return users.find((u) => u._id === userId || u.id === userId)?.name || 'Unknown'
  }

  if (loading) return null

  const pendingRequests = leaveRequests.filter((r) => String(r.status).toLowerCase() === 'pending')
  const decidedRequests = leaveRequests.filter((r) => String(r.status).toLowerCase() !== 'pending')

  const filteredAttendance = selectedEmployeeId
    ? attendance.filter((a) => a.user?._id === selectedEmployeeId || a.user === selectedEmployeeId)
    : attendance

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin dashboard</h1>
          <p className="admin-subtitle">Welcome, {admin.name}</p>
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
          <span className="stat-number">{attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length}</span>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.department || '—'}</td>
                    <td>{u.salary ? `₹${u.salary}` : '—'}</td>
                    <td>
                      <button
                        className="link-btn"
                        onClick={() => {
                          setSelectedEmployeeId(u._id || u.id)
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
                <li key={r._id || r.id} className="leave-approval-card">
                  <div>
                    <p className="request-name">{getUserName(r.user)}</p>
                    <p className="request-type">Leave request</p>
                    <p className="request-dates">
                      {r.from} → {r.to}
                    </p>
                    {r.reason && <p className="request-remarks">"{r.reason}"</p>}
                  </div>
                  <div className="approval-actions">
                    <button className="btn-approve" onClick={() => handleLeaveDecision(r._id || r.id, 'approved')}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleLeaveDecision(r._id || r.id, 'rejected')}>
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
                  <li key={r._id || r.id} className="leave-approval-card decided">
                    <div>
                      <p className="request-name">{getUserName(r.user)}</p>
                      <p className="request-type">Leave request</p>
                      <p className="request-dates">
                        {r.from} → {r.to}
                      </p>
                    </div>
                    <span className={`status-badge status-${String(r.status).toLowerCase()}`}>{r.status}</span>
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
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name}
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
                  <tr key={a._id || a.id}>
                    <td>{a.user?.name || getUserName(a.user)}</td>
                    <td>{a.date}</td>
                    <td>
                      <span className={`status-badge status-${String(a.status || 'inside').toLowerCase()}`}>
                        {a.status || 'INSIDE'}
                      </span>
                    </td>
                    <td>{a.entrytime ? new Date(a.entrytime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td>{a.exittime ? new Date(a.exittime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
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