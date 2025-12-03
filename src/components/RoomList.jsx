"use client"

import { useState } from "react"
import axios from "axios"
import "./RoomList.css"

const SERVER_URL = import.meta.env.VITE_API_URL


export default function RoomList({ rooms, user, onJoinRoom }) {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [error, setError] = useState("")
  const [joining, setJoining] = useState(false)

  const handleJoinClick = (room) => {
    if (room.password) {
      setSelectedRoom(room)
      setPasswordInput("")
      setError("")
    } else {
      handleJoinRoom(room, "")
    }
  }

  const handleJoinRoom = async (room, pwd) => {
    try {
      setJoining(true)
      const { data } = await axios.post(
        `${SERVER_URL}/api/rooms/${room._id}/join`,
        { password: pwd },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      setSelectedRoom(null)
      setPasswordInput("")
      onJoinRoom(data)
    } catch (error) {
      setError(error.response?.data?.error || "Failed to join room")
      setJoining(false)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    handleJoinRoom(selectedRoom, passwordInput)
  }

  return (
    <>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <div className="room-info">
              <h3>{room.name}</h3>
              <p className="room-host">Host: {room.host?.username || "Unknown"}</p>
              <p className="room-players">
                {room.players?.length || 0}/{room.maxPlayers} Players
              </p>
              {room.password && <p className="room-locked">🔒 Password Protected</p>}
              <p className="room-duration">Duration: {room.gameDuration}s</p>
            </div>
            <button
              onClick={() => handleJoinClick(room)}
              className="join-btn"
              disabled={room.players?.length >= room.maxPlayers}
            >
              {room.players?.length >= room.maxPlayers ? "Full" : "Join"}
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Enter Room Password</h2>
            <p>This room is password protected</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Room password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                required
              />
              {error && <p className="error-message">{error}</p>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setSelectedRoom(null)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="confirm-btn" disabled={joining}>
                  {joining ? "Joining..." : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
