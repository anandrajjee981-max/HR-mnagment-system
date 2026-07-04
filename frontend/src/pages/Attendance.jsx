import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api'
import './Attendance.css'

function Attendance() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkedInToday, setCheckedInToday] = useState(false)

  const today = new Date().toISOString().split('T')[0] // e.g. "2026-07-04"

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    setUser(currentUser)
    loadAttendance(currentUser.id)
  }, [navigate])

  async function loadAttendance(userId) {
  const res = await api.get(`/attendance?userId=${userId}`)
  const sorted = [...res.data].sort((a, b) => b.date.localeCompare(a.date))
  setRecords(sorted)
  setCheckedInToday(res.data.some((r) => r.date === today))
  setLoading(false)
}

  async function handleCheckIn() {
    const newRecord = {
      userId: user.id,
      date: today,
      status: 'Present',
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
    }
    await api.post('/attendance', newRecord)
    await loadAttendance(user.id)
  }

  async function handleCheckOut() {
    const todayRecord = records.find((r) => r.date === today)
    if (!todayRecord) return
    await api.patch(`/attendance/${todayRecord.id}`, {
      checkOut: new Date().toLocaleTimeString(),
    })
    await loadAttendance(user.id)
  }

  const todayRecord = records.find((r) => r.date === today)

  if (loading) return null

  return (
    <div className="attendance-page">
      <h1>Attendance</h1>

      <div className="checkin-card">
  <div>
    <p className="checkin-label">Today, {today}</p>
    {todayRecord?.checkIn && (
      <p className="checkin-time">Checked in at {todayRecord.checkIn}</p>
    )}
    {todayRecord?.checkOut && (
      <p className="checkin-time">Checked out at {todayRecord.checkOut}</p>
    )}
  </div>

  {!checkedInToday && (
    <div className="qr-section">
      <QRCodeSVG value={`checkin:${user.id}:${today}`} size={120} />
      <button className="btn-primary" onClick={handleCheckIn}>
        Scan to check in
      </button>
    </div>
  )}
  {checkedInToday && !todayRecord?.checkOut && (
    <div className="qr-section">
      <QRCodeSVG value={`checkout:${user.id}:${today}`} size={120} />
      <button className="btn-secondary" onClick={handleCheckOut}>
        Scan to check out
      </button>
    </div>
  )}
  {todayRecord?.checkOut && <span className="done-badge">Day complete</span>}
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
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>
                  <span className={`status-badge status-${r.status.toLowerCase().replace(' ', '-')}`}>
                    {r.status}
                  </span>
                </td>
                <td>{r.checkIn || '—'}</td>
                <td>{r.checkOut || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Attendance