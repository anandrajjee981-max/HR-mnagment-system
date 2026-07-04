import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [payroll, setPayroll] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ phone: '', address: '', profilePic: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) {
      navigate('/')
      return
    }
    const currentUser = JSON.parse(stored)
    loadProfile(currentUser._id || currentUser.id)
  }, [navigate])

  async function loadProfile(userId) {
    try {
      const res = await api.get('/auth/getme')
      const profile = res.data.user || null
      setUser(profile)
      setForm({
        phone: profile?.phone || '',
        address: profile?.address || '',
        profilePic: profile?.profilePic || '',
      })

      const salary = profile?.salary || 0
      setPayroll({
        baseSalary: salary,
        deductions: 0,
        netSalary: salary,
      })
    } catch (err) {
      setUser(null)
      setPayroll(null)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updatedUser = { ...user, ...form }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm({ phone: user?.phone || '', address: user?.address || '', profilePic: user?.profilePic || '' })
    setEditing(false)
  }

  if (loading) return null

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          {form.profilePic ? (
            <img src={form.profilePic} alt={user?.name} className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">{initials}</div>
          )}
          <div>
            <h2>{user?.name}</h2>
            <p className="profile-role">{user?.role || 'Employee'}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Personal details</h3>
          <div className="field-row">
            <span className="field-label">Email</span>
            <span className="field-value">{user?.email}</span>
          </div>

          <div className="field-row">
            <span className="field-label">Phone</span>
            {editing ? (
              <input name="phone" value={form.phone} onChange={handleChange} />
            ) : (
              <span className="field-value">{user?.phone || '—'}</span>
            )}
          </div>

          <div className="field-row">
            <span className="field-label">Address</span>
            {editing ? (
              <input name="address" value={form.address} onChange={handleChange} />
            ) : (
              <span className="field-value">{user?.address || '—'}</span>
            )}
          </div>

          <div className="field-row">
            <span className="field-label">Profile image URL</span>
            {editing ? (
              <input name="profilePic" value={form.profilePic} onChange={handleChange} placeholder="https://..." />
            ) : (
              <span className="field-value">{user?.profilePic || '—'}</span>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Job details</h3>
          <div className="field-row">
            <span className="field-label">Department</span>
            <span className="field-value">{user?.department || '—'}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Role</span>
            <span className="field-value">{user?.role || 'Employee'}</span>
          </div>
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