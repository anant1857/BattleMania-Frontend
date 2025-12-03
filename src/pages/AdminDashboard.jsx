"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./AdminDashboard.css"

const SERVER_URL = "https://battlemania-backend.onrender.com"

export default function AdminDashboard({ user, onLogout, onBack }) {
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (user.role !== "admin") {
      alert("Access denied. Admin only.")
      onBack()
      return
    }
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    if (activeTab === "users") fetchUsers()
    if (activeTab === "rooms") fetchRooms()
    if (activeTab === "matches") fetchMatches()
  }, [activeTab])

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/admin/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setRooms(data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    }
  }

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/admin/matches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setMatches(data)
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    
    try {
      await axios.delete(`${SERVER_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      alert("User deleted successfully")
      fetchUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
      alert("Failed to delete user")
    }
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      await axios.patch(`${SERVER_URL}/api/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      alert("User status updated")
      fetchUsers()
    } catch (error) {
      console.error("Failed to toggle user status:", error)
      alert("Failed to update user status")
    }
  }

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return
    
    try {
      await axios.delete(`${SERVER_URL}/api/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      alert("Room deleted successfully")
      fetchRooms()
    } catch (error) {
      console.error("Failed to delete room:", error)
      alert("Failed to delete room")
    }
  }

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return
    
    try {
      await axios.delete(`${SERVER_URL}/api/admin/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      alert("Match deleted successfully")
      fetchMatches()
    } catch (error) {
      console.error("Failed to delete match:", error)
      alert("Failed to delete match")
    }
  }

  const viewUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setSelectedUser(data)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Admin: {user.username}</span>
          <button onClick={onBack} className="back-btn">← Back</button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="admin-nav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button
          className={activeTab === "rooms" ? "active" : ""}
          onClick={() => setActiveTab("rooms")}
        >
          🏠 Rooms
        </button>
        <button
          className={activeTab === "matches" ? "active" : ""}
          onClick={() => setActiveTab("matches")}
        >
          🎮 Matches
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === "dashboard" && stats && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Rooms</h3>
                <p className="stat-value">{stats.totalRooms}</p>
              </div>
              <div className="stat-card">
                <h3>Total Matches</h3>
                <p className="stat-value">{stats.totalMatches}</p>
              </div>
              <div className="stat-card">
                <h3>Active Rooms</h3>
                <p className="stat-value">{stats.activeRooms}</p>
              </div>
            </div>

            <div className="recent-matches">
              <h2>Recent Matches</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Match ID</th>
                    <th>Winner</th>
                    <th>Players</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMatches.map((match) => (
                    <tr key={match._id}>
                      <td>{match._id.slice(-6)}</td>
                      <td>{match.winner?.username || "Draw"}</td>
                      <td>{match.players.map(p => p.username).join(", ")}</td>
                      <td>{new Date(match.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-tab">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gamesPlayed}</td>
                    <td>{user.wins}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button onClick={() => viewUserDetails(user._id)} className="btn-view">
                        View
                      </button>
                      <button onClick={() => handleToggleUserStatus(user._id)} className="btn-toggle">
                        Toggle
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="rooms-tab">
            <h2>Room Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Host</th>
                  <th>Players</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room.name}</td>
                    <td>{room.host.username}</td>
                    <td>{room.players.length}/{room.maxPlayers}</td>
                    <td>
                      <span className={`status-badge ${room.status}`}>
                        {room.status}
                      </span>
                    </td>
                    <td>{new Date(room.createdAt).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleDeleteRoom(room._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="matches-tab">
            <h2>Match Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Room</th>
                  <th>Winner</th>
                  <th>Players</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match._id}>
                    <td>{match._id.slice(-6)}</td>
                    <td>{match.room?.name || "N/A"}</td>
                    <td>{match.winner?.username || "Draw"}</td>
                    <td>{match.players.map(p => p.username).join(", ")}</td>
                    <td>{match.duration}s</td>
                    <td>{new Date(match.createdAt).toLocaleString()}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleDeleteMatch(match._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="user-info-grid">
                <div>
                  <strong>Username:</strong> {selectedUser.user.username}
                </div>
                <div>
                  <strong>Email:</strong> {selectedUser.user.email}
                </div>
                <div>
                  <strong>Games Played:</strong> {selectedUser.user.gamesPlayed}
                </div>
                <div>
                  <strong>Wins:</strong> {selectedUser.user.wins}
                </div>
                <div>
                  <strong>Losses:</strong> {selectedUser.user.losses}
                </div>
                <div>
                  <strong>Total Score:</strong> {selectedUser.user.totalScore}
                </div>
              </div>

              <h3>Match History</h3>
              <div className="match-history-list">
                {selectedUser.matches.map((match) => (
                  <div key={match._id} className="match-item">
                    <span>{match.winner?.username === selectedUser.user.username ? "WIN" : "LOSS"}</span>
                    <span>Score: {match.scores?.get ? match.scores.get(selectedUser.user._id) : match.scores[selectedUser.user._id]}</span>
                    <span>{new Date(match.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
