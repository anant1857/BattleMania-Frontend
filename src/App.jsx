"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Login from "./pages/Login"
import Lobby from "./pages/Lobby"
import Match from "./pages/Match"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [selectedRoom, setSelectedRoom] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      const userData = JSON.parse(storedUser)
      setUser(userData)
      if (userData.role === "admin") {
        setCurrentPage("admin")
      } else {
        setCurrentPage("lobby")
      }
    }
  }, [])

  const handleLogin = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    if (userData.role === "admin") {
      setCurrentPage("admin")
    } else {
      setCurrentPage("lobby")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setSelectedRoom(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentPage("login")
  }

  const handleJoinRoom = (room) => {
    setSelectedRoom(room)
    setCurrentPage("match")
  }

  const handleBackToLobby = () => {
    setSelectedRoom(null)
    setCurrentPage("lobby")
  }

  const handleViewProfile = () => {
    setCurrentPage("profile")
  }

  const handleBackToLobbyFromProfile = () => {
    setCurrentPage("lobby")
  }

  const handleBackFromAdmin = () => {
    setCurrentPage("lobby")
  }

  return (
    <div className="app">
      {currentPage === "login" && <Login onLogin={handleLogin} />}
      
      {currentPage === "admin" && user && user.role === "admin" && (
        <AdminDashboard 
          user={user} 
          onLogout={handleLogout}
          onBack={handleBackFromAdmin}
        />
      )}
      
      {currentPage === "lobby" && user && (
        <Lobby 
          user={user} 
          onLogout={handleLogout} 
          onJoinRoom={handleJoinRoom}
          onViewProfile={handleViewProfile}
        />
      )}
      
      {currentPage === "match" && user && selectedRoom && (
        <Match 
          user={user} 
          room={selectedRoom} 
          onBack={handleBackToLobby} 
        />
      )}
      
      {currentPage === "profile" && user && (
        <Profile 
          user={user} 
          onBack={handleBackToLobbyFromProfile} 
        />
      )}
    </div>
  )
}
