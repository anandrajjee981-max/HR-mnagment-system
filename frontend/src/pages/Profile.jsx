import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [payroll, setPayroll] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ phone: '', address: '', photoUrl: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    loadProfile(currentUser.id)
  }, [navigate])

  async function loadProfile(userId) {
    const res = await api.get(`/users/${userId}`)
    setUser(res.data)
    setForm({
      phone: res.data.phone || '',
      address: res.data.address || '',
      photoUrl: res.data.photoUrl || '',
    })

    const payrollRes = await api.get(`/payroll?userId=${userId}`)
    setPayroll(payrollRes.data[0] || null)
    setLoading(false)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    setSaving(true)
    await api.patch(`/users/${user.id}`, form)
    const updatedUser = { ...user, ...form }
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser)) // keep session in sync
    setEditing(false)
    setSaving(false)
  }

  function handleCancel() {
    setForm({ phone: user.phone || '', address: user.address || '', photoUrl: user.photoUrl || '' })
    setEditing(false)
  }

  if (loading) return null

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          {form.photoUrl ? (
            <img src={form.photoUrl} alt={user.fullName} className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">{initials}</div>
          )}
          <div>
            <h2>{user.fullName}</h2>
            <p className="profile-role">{user.jobTitle || 'No job title set'}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Personal details</h3>
          <div className="field-row">
            <span className="field-label">Employee ID</span>
            <span className="field-value">{user.employeeId}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Email</span>
            <span className="field-value">{user.email}</span>
          </div>

          <div className="field-row">
            <span className="field-label">Phone</span>
            {editing ? (
              <input name="phone" value={form.phone} onChange={handleChange} />
            ) : (
              <span className="field-value">{user.phone || '—'}</span>
            )}
          </div>

          <div className="field-row">
            <span className="field-label">Address</span>
            {editing ? (
              <input name="address" value={form.address} onChange={handleChange} />
            ) : (
              <span className="field-value">{user.address || '—'}</span>
            )}
          </div>

          <div className="field-row">
            <span className="field-label">Photo URL</span>
            {editing ? (
              <input name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="https://..." />
            ) : (
              <span className="field-value">{user.photoUrl || '—'}</span>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Job details</h3>
          <div className="field-row">
            <span className="field-label">Department</span>
            <span className="field-value">{user.department || '—'}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Joined</span>
            <span className="field-value">{user.joinDate || '—'}</span>
          </div>
          <p className="field-note">Job details can only be changed by Admin/HR</p>
        </div>

        <div className="profile-section">
          <h3>Salary</h3>
          {payroll ? (
            <>
              <div className="field-row">
                <span className="field-label">Base salary</span>
                <span className="field-value">₹{payroll.baseSalary.toLocaleString()}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Deductions</span>
                <span className="field-value">₹{payroll.deductions.toLocaleString()}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Net salary</span>
                <span className="field-value field-highlight">₹{payroll.netSalary.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <p className="field-note">No salary data available</p>
          )}
          <p className="field-note">Read-only — salary is managed by Admin/HR</p>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile