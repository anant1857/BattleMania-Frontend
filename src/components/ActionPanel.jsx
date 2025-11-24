"use client"

import "./ActionPanel.css"

export default function ActionPanel({ gameActive, onSpawnUnit }) {
  const unitTypes = [
    { name: "Soldier", icon: "⚔️", description: "Fast, Medium Damage" },
    { name: "Tank", icon: "🛡️", description: "Slow, High Damage" },
    { name: "Turret", icon: "🔫", description: "Stationary, Medium Damage" },
  ]

  return (
    <div className="action-panel">
      <h3>Spawn Units</h3>
      <p className="panel-subtitle">{gameActive ? "Click to spawn units" : "Game not started"}</p>
      <div className="units-grid">
        {unitTypes.map((unit) => (
          <button
            key={unit.name}
            onClick={() => onSpawnUnit(unit.name.toLowerCase())}
            disabled={!gameActive}
            className="unit-btn"
            title={unit.description}
          >
            <div className="unit-icon">{unit.icon}</div>
            <div className="unit-name">{unit.name}</div>
            <div className="unit-desc">{unit.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
