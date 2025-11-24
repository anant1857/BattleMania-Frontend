"use client"

import "./Profile.css"

export default function Profile({ user, onBack }) {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1>Player Profile</h1>
        <div />
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar">
            <img src="https://via.placeholder.com/100" alt="avatar" />
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="email">{user.email}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Wins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Losses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
