"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Lobby.css"
import RoomList from "../components/RoomList"
import CreateRoomModal from "../components/CreateRoomModal"

export default function Lobby({ user, onLogout, onJoinRoom, onViewProfile }) {
  const [rooms, setRooms] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms")
      setRooms(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      setLoading(false)
    }
  }

  const handleCreateRoom = async (roomData) => {
    try {
      const { data } = await axios.post(
        "/api/rooms",
        {
          name: roomData.name,
          password: roomData.password,
          gameDuration: roomData.gameDuration,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      setShowCreateModal(false)
      onJoinRoom(data)
    } catch (error) {
      console.error("Failed to create room:", error)
    }
  }

  return (
    <div className="lobby-container">
      <header className="lobby-header">
        <h1>BATTLEGAME LOBBY</h1>
        <div className="user-info">
          <button onClick={onViewProfile} className="profile-btn">
            👤 Profile
          </button>
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="lobby-content">
        <div className="lobby-section">
          <div className="section-header">
            <h2>Available Rooms</h2>
            <button onClick={() => setShowCreateModal(true)} className="create-btn">
              + Create Room
            </button>
          </div>

          {loading ? (
            <p className="loading">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="no-rooms">No rooms available. Create one to start!</p>
          ) : (
            <RoomList rooms={rooms} user={user} onJoinRoom={onJoinRoom} />
          )}
        </div>
      </div>

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateRoom} />}
    </div>
  )
}
