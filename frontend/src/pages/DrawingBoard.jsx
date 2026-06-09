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
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx

    function resize() {
      // preserve image by copying to temp canvas
      const temp = document.createElement('canvas')
      temp.width = canvas.width
      temp.height = canvas.height
      temp.getContext('2d').drawImage(canvas, 0, 0)

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      ctx.drawImage(temp, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current

    function onDown(e) {
      isDrawingRef.current = true
      const ctx = ctxRef.current
      if (currentToolRef.current === 'pencil') {
        ctx.strokeStyle = colorRef.current
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 20
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }

    function onMove(e) {
      if (!isDrawingRef.current) return
      const ctx = ctxRef.current
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }

    function onUp() { isDrawingRef.current = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
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
