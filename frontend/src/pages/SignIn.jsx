import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Auth.css'

function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // json-server doesn't have real login, so we query and check manually
      const res = await api.get(`/users?email=${email}`)
      const user = res.data[0]

      if (!user || user.password !== password) {
        setError('Incorrect email or password')
        setLoading(false)
        return
      }

      // Save logged-in user so other pages know who's active
      localStorage.setItem('currentUser', JSON.stringify(user))

      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Is json-server running?')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <p className="auth-subtitle">Access your HR dashboard</p>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

export default SignIn