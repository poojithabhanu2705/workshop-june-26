import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, getCurrentUser } from '../api/auth'

export default function SignUp() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    getCurrentUser().then((u) => { if (u) navigate('/app') })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await signUp(name.trim(), email.trim(), password)
      if (res && res.user) {
        alert('Account created! Please sign in.')
        navigate('/signin')
      } else {
        setError(res.message || 'Sign up failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error')
    }
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">🎨 Drawing App</h1>
      <h2 className="auth-subtitle">Create an account</h2>
      {error && <p className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" required />
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        <button className="auth-btn" type="submit">Sign Up</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/signin">Sign In</Link></p>
    </div>
  )
}
