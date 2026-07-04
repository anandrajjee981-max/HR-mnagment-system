import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Auth.css'

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validatePassword(password) {
    // At least 8 chars, one uppercase, one number
    const rule = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return rule.test(password)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!validatePassword(form.password)) {
      setError('Password must be at least 8 characters, with one uppercase letter and one number')
      return
    }

    setLoading(true)

    try {
      // Check if email already exists
      const existing = await api.get(`/users?email=${form.email}`)
      if (existing.data.length > 0) {
        setError('An account with this email already exists')
        setLoading(false)
        return
      }

      // Create the new user
      await api.post('/users', {
        employeeId: form.employeeId,
        fullName: form.fullName,
        email: form.email,
        password: form.password, // fine for fake DB only, never do this for real
        role: form.role,
      })

      navigate('/') // send them to Sign In after successful signup
    } catch (err) {
      setError('Something went wrong. Is json-server running?')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-subtitle">Register to access the HR system</p>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="employeeId">Employee ID</label>
        <input
          id="employeeId"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          placeholder="EMP001"
          required
        />

        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Jane Smith"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          required
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="admin">Admin / HR</option>
        </select>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          required
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp