import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import DrawingBoard from './pages/DrawingBoard'
import { getCurrentUser } from './api/auth'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u)
        setLoading(false)
      }
    })
    return () => (mounted = false)
  }, [])

  if (loading) return <div className="center">Loading...</div>
  if (!user) return <Navigate to="/signin" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DrawingBoard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
