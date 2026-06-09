import React from 'react'
import { getCurrentUser, logout } from '../api/auth'

export default function Navbar() {
  const [userName, setUserName] = React.useState('')

  React.useEffect(() => {
    getCurrentUser().then((u) => { if (u) setUserName(u.name || '') })
  }, [])

  function selectTool(tool) {
    // dispatch a simple DOM event the Canvas listens for
    window.dispatchEvent(new CustomEvent('tool-change', { detail: tool }))
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'))
    document.getElementById('btn-' + tool).classList.add('active')
  }

  function onColor(e) {
    window.dispatchEvent(new CustomEvent('color-change', { detail: e.target.value }))
  }

  return (
    <nav className="navbar">
      <span className="app-title">🎨 Drawing App</span>
      <div className="tools">
        <button id="btn-pencil" className="tool-btn active" onClick={() => selectTool('pencil')}>✏️ Pencil</button>
        <button id="btn-eraser" className="tool-btn" onClick={() => selectTool('eraser')}>🧹 Eraser</button>
        <label htmlFor="color-picker">Color:</label>
        <input id="color-picker" type="color" defaultValue="#000000" onInput={onColor} />
        <span className="user-name">{userName}</span>
        <button className="tool-btn logout-btn" onClick={() => { logout(); window.location.href = '/signin' }}>Logout</button>
      </div>
    </nav>
  )
}
