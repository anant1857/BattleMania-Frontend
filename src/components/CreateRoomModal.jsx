"use client"

import { useState } from "react"
import "./CreateRoomModal.css"

export default function CreateRoomModal({ onClose, onCreate }) {
  const [roomName, setRoomName] = useState("")
  const [password, setPassword] = useState("")
  const [gameDuration, setGameDuration] = useState(300)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (roomName.trim()) {
      onCreate({
        name: roomName,
        password: password,
        gameDuration: Number.parseInt(gameDuration),
      })
      setRoomName("")
      setPassword("")
      setGameDuration(300)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="roomName">Room Name</label>
            <input
              id="roomName"
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Room Password (Optional)</label>
            <input
              id="password"
              type="password"
              placeholder="Leave empty for no password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Game Duration</label>
            <select id="duration" value={gameDuration} onChange={(e) => setGameDuration(e.target.value)}>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={900}>15 minutes</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="confirm-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
