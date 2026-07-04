import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import api from '../api'
import 'react-datepicker/dist/react-datepicker.css'
import './Leave.css'

function Leave() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [leaveType, setLeaveType] = useState('Paid')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    setUser(currentUser)
    loadRequests(currentUser.id)
  }, [navigate])

  async function loadRequests(userId) {
    const res = await api.get(`/leaveRequests?userId=${userId}&_sort=startDate&_order=desc`)
    setRequests(res.data)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      setError('Please select a start and end date')
      return
    }
    if (endDate < startDate) {
      setError('End date cannot be before start date')
      return
    }

    setSubmitting(true)

    const newRequest = {
      userId: user.id,
      leaveType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      remarks,
      status: 'Pending',
    }

    await api.post('/leaveRequests', newRequest)
    await loadRequests(user.id)

    // reset form
    setLeaveType('Paid')
    setStartDate(null)
    setEndDate(null)
    setRemarks('')
    setSubmitting(false)
  }

  if (loading) return null

  return (
    <div className="leave-page">
      <h1>Leave requests</h1>

      <form className="leave-form" onSubmit={handleSubmit}>
        <h2>Apply for leave</h2>

        {error && <div className="leave-error">{error}</div>}

        <label htmlFor="leaveType">Leave type</label>
        <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="Paid">Paid</option>
          <option value="Sick">Sick</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <div className="date-row">
          <div>
            <label>Start date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label>End date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <label htmlFor="remarks">Remarks</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Reason for leave (optional)"
          rows={3}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit request'}
        </button>
      </form>

      <h2 className="section-title">Your requests</h2>

      {requests.length === 0 ? (
        <p className="empty-state">No leave requests yet</p>
      ) : (
        <ul className="request-list">
          {requests.map((r) => (
            <li key={r.id} className="request-card">
              <div>
                <p className="request-type">{r.leaveType} leave</p>
                <p className="request-dates">
                  {r.startDate} → {r.endDate}
                </p>
                {r.remarks && <p className="request-remarks">{r.remarks}</p>}
              </div>
              <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Leave