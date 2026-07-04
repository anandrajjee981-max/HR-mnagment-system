import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './Attendance.css'

function Attendance() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    setUser(currentUser)
    loadAttendance()
  }, [navigate])

  async function loadAttendance() {
    try {
      setError('')
      const res = await api.get('/attend/getattend')
      const data = res.data.attendance || []
      const sorted = [...data].sort((a, b) => String(b.date).localeCompare(String(a.date)))

      setRecords(sorted)
      setCheckedInToday(sorted.some((r) => String(r.date) === today && !r.exittime))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckIn() {
    try {
      setError('')
      setLoading(true)
      await api.post('/attend/checkin')
      await loadAttendance()
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed.')
      setLoading(false)
    }
  }

  async function handleCheckOut() {
    try {
      setError('')
      setLoading(true)
      await api.post('/attend/checkout')
      await loadAttendance()
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed.')
      setLoading(false)
    }
  }

  const todayRecord = records.find((r) => String(r.date) === today)

  if (loading) return <div className="loading-state">Loading...</div>

  const formatTime = (isoString) => {
    if (!isoString) return '—'
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="attendance-page">
      <h1>Attendance</h1>

      {error && <div className="error-message-banner">{error}</div>}

      <div className="checkin-card">
        <div className="status-info">
          <p className="checkin-label">Today, {today}</p>
          {todayRecord?.entrytime && (
            <p className="checkin-time">Checked in at <span>{formatTime(todayRecord.entrytime)}</span></p>
          )}
          {todayRecord?.exittime && (
            <p className="checkin-time">Checked out at <span>{formatTime(todayRecord.exittime)}</span></p>
          )}
        </div>

        <div className="action-section">
          {!checkedInToday && (
            <button className="btn-action btn-checkin" onClick={handleCheckIn}>
              Check In
            </button>
          )}
          {checkedInToday && !todayRecord?.exittime && (
            <button className="btn-action btn-checkout" onClick={handleCheckOut}>
              Check Out
            </button>
          )}
          {todayRecord?.exittime && (
            <span className="done-badge">Day Complete</span>
          )}
        </div>
      </div>

      <h2 className="section-title">History</h2>

      {records.length === 0 ? (
        <p className="empty-state">No attendance records yet</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check-in</th>
              <th>Check-out</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id || r.id}>
                <td>{r.date}</td>
                <td>
                  <span className={`status-badge status-${String(r.status || 'inside').toLowerCase()}`}>
                    {r.status || 'INSIDE'}
                  </span>
                </td>
                <td>{formatTime(r.entrytime)}</td>
                <td>{formatTime(r.exittime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Attendance