import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Auth.css'

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: '',
    salary: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validatePassword(password) {
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
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        salary: Number(form.salary) || 0,
        address: form.address,
        ...(form.phone ? { phone: Number(form.phone) } : {}),
      }

      await api.post('/auth/register', payload)
      navigate('/')
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-subtitle">Register to access the HR system</p>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          value={form.name}
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

        <label htmlFor="department">Department</label>
        <input
          id="department"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Engineering"
          required
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="admin">Admin / HR</option>
        </select>

        <label htmlFor="salary">Salary</label>
        <input
          id="salary"
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          placeholder="50000"
        />

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="number"
          value={form.phone}
          onChange={handleChange}
          placeholder="9876543210"
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="City, State"
          required
        />

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