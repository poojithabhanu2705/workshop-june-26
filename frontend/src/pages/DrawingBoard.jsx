import React from 'react'
import Navbar from '../shared/Navbar'

export default function DrawingBoard() {
  return (
    <div className="app-root">
      <Navbar />
      <Canvas />
    </div>
  )
}

function Canvas() {
  const canvasRef = React.useRef(null)
  const ctxRef = React.useRef(null)
  const isDrawingRef = React.useRef(false)
  const currentToolRef = React.useRef('pencil')
  const colorRef = React.useRef('#000000')
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize canvas size and 2D context with devicePixelRatio handling
    function setSize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // Set the internal pixel size of the canvas
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)

      // Make the CSS size match the layout size
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      const ctx = canvas.getContext('2d')
      // Reset the transform before scaling to avoid accumulating scales
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctxRef.current = ctx
    }

    // Helper: get mouse coordinates relative to the canvas (CSS pixels)
    function getXY(e) {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onDown(e) {
      isDrawingRef.current = true
      const ctx = ctxRef.current
      if (!ctx) return
      if (currentToolRef.current === 'pencil') {
        ctx.strokeStyle = colorRef.current
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 20
      }
      ctx.beginPath()
      const p = getXY(e)
      ctx.moveTo(p.x, p.y)
    }

    function onMove(e) {
      if (!isDrawingRef.current) return
      const ctx = ctxRef.current
      if (!ctx) return
      const p = getXY(e)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }

    function onUp() { isDrawingRef.current = false }

    // Initialize size after layout
    setTimeout(setSize, 0)
    window.addEventListener('resize', setSize)

    // Attach DOM mouse event listeners
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onUp)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('resize', setSize)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onUp)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // Handlers from Navbar (simple pub-sub via window events)
  React.useEffect(() => {
    function onTool(e) { currentToolRef.current = e.detail }
    function onColor(e) { colorRef.current = e.detail }
    window.addEventListener('tool-change', onTool)
    window.addEventListener('color-change', onColor)
    return () => {
      window.removeEventListener('tool-change', onTool)
      window.removeEventListener('color-change', onColor)
    }
  }, [])

  return <canvas id="drawing-canvas" ref={canvasRef} />
}
