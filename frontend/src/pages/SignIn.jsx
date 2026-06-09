import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, getCurrentUser } from '../api/auth'

export default function SignIn() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    // If already signed in, redirect
    getCurrentUser().then((u) => { if (u) navigate('/app') })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await signIn(email.trim(), password)
      if (res && res.token) {
        navigate('/app')
      } else {
        setError(res.message || 'Sign in failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error')
    }
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">🎨 Drawing App</h1>
      <h2 className="auth-subtitle">Sign in to continue</h2>
      {error && <p className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        <button className="auth-btn" type="submit">Sign In</button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  )
}
