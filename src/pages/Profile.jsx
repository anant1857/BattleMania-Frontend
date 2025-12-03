"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Profile.css"

const SERVER_URL = import.meta.env.VITE_API_URL;

// const SERVER_URL = "http://localhost:5000"

export default function Profile({ user, onBack }) {
  const [userData, setUserData] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
    fetchMatches()
  }, [user.id])

  const fetchUserData = async () => {
    try {
      // Updated to match your backend route: /api/users/:userId/profile
      const { data } = await axios.get(`${SERVER_URL}/api/users/${user.id}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUserData(data)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/matches/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setMatches(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch matches:", error)
      setLoading(false)
    }
  }

  if (loading || !userData) {
    return <div className="profile-container loading">Loading profile...</div>
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Lobby
        </button>
        <h1>Player Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">{userData.username[0].toUpperCase()}</div>
          </div>
          <h2>{userData.username}</h2>
          <p className="email">{userData.email}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Games Played</h3>
            <p className="stat-value">{userData.gamesPlayed || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Wins</h3>
            <p className="stat-value wins">{userData.wins || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Losses</h3>
            <p className="stat-value losses">{userData.losses || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Draws</h3>
            <p className="stat-value draws">{userData.draws || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Win Rate</h3>
            <p className="stat-value">{userData.winRate || 0}%</p>
          </div>
          <div className="stat-card">
            <h3>Total Score</h3>
            <p className="stat-value">{userData.totalScore || 0}</p>
          </div>
        </div>

        <div className="match-history">
          <h3>Match History</h3>
          {matches.length === 0 ? (
            <p className="no-matches">No matches played yet</p>
          ) : (
            <div className="matches-list">
              {matches.map((match) => (
                <div key={match._id} className="match-card">
                  <div className="match-result">
                    {match.winner?._id === user.id ? (
                      <span className="result-badge win">WIN</span>
                    ) : match.winner === null ? (
                      <span className="result-badge draw">DRAW</span>
                    ) : (
                      <span className="result-badge loss">LOSS</span>
                    )}
                  </div>
                  <div className="match-details">
                    <p className="match-score">
                      Your Score: <strong>{match.scores?.get ? match.scores.get(user.id) : match.scores[user.id] || 0}</strong>
                    </p>
                    <p className="match-date">
                      {new Date(match.createdAt).toLocaleDateString()} at{" "}
                      {new Date(match.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="match-duration">Duration: {match.duration}s</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
