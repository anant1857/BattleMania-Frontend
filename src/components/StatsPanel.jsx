import "./StatsPanel.css"

export default function StatsPanel({ gameState, players, userId }) {
  return (
    <div className="stats-panel">
      <h3>Scoreboard</h3>
      <div className="scores">
        {players?.map((player) => (
          <div key={player._id} className="score-row">
            <span className={`player-name ${player._id === userId ? "current" : ""}`}>{player.username}</span>
            <span className="score">{gameState.scores?.[player._id] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
