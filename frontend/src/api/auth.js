import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

// Save token in localStorage
export function saveToken(token) {
  localStorage.setItem('drawing_app_token', token)
}

export function getToken() {
  return localStorage.getItem('drawing_app_token')
}

export function removeToken() {
  localStorage.removeItem('drawing_app_token')
}

export async function signUp(name, email, password) {
  const res = await API.post('/api/auth/signup', { name, email, password })
  return res.data
}

export async function signIn(email, password) {
  const res = await API.post('/api/auth/signin', { email, password })
  // store token
  if (res.data && res.data.token) saveToken(res.data.token)
  return res.data
}

export async function getCurrentUser() {
  const token = getToken()
  if (!token) return null
  try {
    const res = await API.get('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } })
    return res.data.user
  } catch (err) {
    removeToken()
    return null
  }
}

export function logout() {
  removeToken()
}
