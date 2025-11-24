"use client"

import { useEffect, useRef } from "react"
import "./Battlefield.css"

export default function Battlefield({ canvasRef, gameState, userId }) {
  const animationRef = useRef(null)
  const localCanvasRef = useRef(canvasRef)

  useEffect(() => {
    const canvas = localCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    const render = () => {
      // Clear canvas
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "#2a2a2a"
      ctx.lineWidth = 1
      for (let i = 0; i <= width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i <= height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Draw units
      gameState.units?.forEach((unit) => {
        const isPlayerUnit = unit.playerId === userId
        ctx.fillStyle = isPlayerUnit ? "#44aa44" : "#ff4444"

        // Draw unit body
        ctx.beginPath()
        ctx.arc(unit.x, unit.y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw health bar
        const healthPercent = unit.health / unit.maxHealth
        ctx.fillStyle = "#333"
        ctx.fillRect(unit.x - 15, unit.y - 25, 30, 5)
        ctx.fillStyle = healthPercent > 0.5 ? "#44aa44" : healthPercent > 0.25 ? "#ffaa44" : "#ff4444"
        ctx.fillRect(unit.x - 15, unit.y - 25, 30 * healthPercent, 5)

        // Draw unit type label
        ctx.fillStyle = "#888"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(unit.type, unit.x, unit.y + 20)
      })

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, userId])

  return <canvas ref={localCanvasRef} className="battlefield" width={800} height={400} />
}
