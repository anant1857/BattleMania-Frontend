"use client"

import "./GameEndModal.css"

export default function GameEndModal({ gameResult, currentUser, players, onReturnToLobby }) {
  const { winner, scores, isDraw } = gameResult

  const getPlayerName = (playerId) => {
    const player = players.find((p) => p._id === playerId)
    return player ? player.username : "Unknown"
  }

  const isWinner = winner === currentUser.id
  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a)

  return (
    <div className="modal-overlay">
      <div className="modal-content game-end-modal">
        <div className="modal-header">
          <h1>{isDraw ? "🤝 DRAW!" : isWinner ? "🎉 VICTORY!" : "💀 DEFEAT"}</h1>
        </div>

        <div className="modal-body">
          {!isDraw && (
            <div className="winner-announcement">
              <h2>{isWinner ? "You Won!" : `${getPlayerName(winner)} Won!`}</h2>
            </div>
          )}

          <div className="final-scores">
            <h3>Final Scores</h3>
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedScores.map(([playerId, score], index) => (
                  <tr
                    key={playerId}
                    className={playerId === currentUser.id ? "current-user" : ""}
                  >
                    <td className="rank">#{index + 1}</td>
                    <td className="player-name">
                      {getPlayerName(playerId)}
                      {playerId === currentUser.id && " (You)"}
                    </td>
                    <td className="score">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-actions">
            <button onClick={onReturnToLobby} className="return-btn">
              Return to Lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
