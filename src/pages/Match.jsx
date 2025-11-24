"use client"

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import axios from "axios"
import "./Match.css"
import Battlefield from "../components/Battlefield"
import ActionPanel from "../components/ActionPanel"
import StatsPanel from "../components/StatsPanel"

const SERVER_URL = "http://localhost:5000"

export default function Match({ user, room, onBack }) {
  const canvasRef = useRef(null)

  const [socket, setSocket] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(room)
  const [gameState, setGameState] = useState({
    units: [],
    scores: {},
    timeRemaining: currentRoom.gameDuration || 300,
    gameActive: false,
  })
  const [readyStatus, setReadyStatus] = useState({})
  const [allReady, setAllReady] = useState(false)
  const [error, setError] = useState("")
  const [isHost, setIsHost] = useState(false)
  const socketRef = useRef(null)

  // Reconnect to room & socket setup
  useEffect(() => {
    const reconnectToRoom = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/rooms/${room._id}`)
        setCurrentRoom(data)
        setIsHost(data.host._id === user.id)
        // Initialize ready statuses
        const readyMap = {}
        data.players.forEach((player) => {
          readyMap[player._id] = data.readyPlayers.some((rp) => rp._id === player._id)
        })
        setReadyStatus(readyMap)
        const allPlayersReady =
          data.players.length > 1 && data.players.every((p) => data.readyPlayers.some((rp) => rp._id === p._id))
        setAllReady(allPlayersReady)
      } catch (err) {
        console.error("Failed to reconnect to room:", err)
        setError("Failed to reconnect to room")
        setTimeout(onBack, 2000)
      }
    }

    reconnectToRoom()

    const newSocket = io(SERVER_URL)
    socketRef.current = newSocket
    setSocket(newSocket)

    
    newSocket.emit("create_room", { 
  roomId: room._id, 
  hostId: user.id, 
  hostName: user.username 
});
    newSocket.emit("join_room", {
      roomId: room._id,
      playerId: user.id,
      playerName: user.username,
    })

    // Handle updated room state
  newSocket.on("room_updated", (updatedRoom) => {
  setCurrentRoom(updatedRoom)
  // Sync ready status
  const readyMap = {}
  updatedRoom.players.forEach((player) => {
    readyMap[player._id] = updatedRoom.readyPlayers.some((rp) => rp._id === player._id)
  })
  setReadyStatus(readyMap)
  const allPlayersReady = updatedRoom.players.length > 1 &&
    updatedRoom.players.every((p) =>
      updatedRoom.readyPlayers.some((rp) => rp._id === p._id)
    )
  setAllReady(allPlayersReady)
  // ---- ADD THIS: update live game state from Room status
  setGameState((prev) => ({
    ...prev,
    gameActive: updatedRoom.status === "playing",
  }))
})


    newSocket.on("player_joined", () => {
      reconnectToRoom()
    })

    newSocket.on("ready_status", () => {
      reconnectToRoom()
    })

    newSocket.on("all_ready_status", () => {
      reconnectToRoom()
    })

    // --- ADD THESE EVENT LISTENERS ---


    // Listen for game started
    newSocket.on("game_started", () => {
      setGameState((prev) => ({ ...prev, gameActive: true }))
    })

    // Listen for unit_spawned
    newSocket.on("unit_spawned", (unit) => {
      setGameState((prev) => ({
        ...prev,
        units: [...prev.units, unit],
      }))
    })

    // Listen for game tick (periodic state, e.g., units, scores, timer)
newSocket.on("game_tick", (data) => {
  setGameState((prevState) => ({
    ...prevState,  // ← Keep existing properties
    ...data,       // ← Merge in new data
  }))
})

    // Listen for game ended (optional)
    newSocket.on("game_ended", (data) => {
      setGameState((prev) => ({ ...prev, gameActive: false }))
      // Optionally trigger UI state/info here if wanted
    })
    // --- END OF NEW EVENT LISTENERS ---

    return () => {
      newSocket.disconnect()
    }
  }, [room, user, onBack])

  // Toggle ready status
  const toggleReady = () => {
    if (socketRef.current) {
      socketRef.current.emit("toggle_ready", {
        roomId: currentRoom._id,
        playerId: user.id,
        playerName: user.username,
      })
    }
  }

  // Start game only if host and all ready
  const startGame = () => {
    if (socketRef.current && allReady) {
      socketRef.current.emit("start_game", { roomId: currentRoom._id })
    }
  }

  // Spawn unit
  const spawnUnit = (unitType) => {
    if (socketRef.current && gameState.gameActive) {
      const x = Math.random() * 600 + 50
      const y = Math.random() * 400 + 50
      socketRef.current.emit("spawn_unit", {
        roomId: currentRoom._id,
        playerId: user.id,
        unitType,
        x,
        y,
      })
    }
  }

  if (error) {
    return (
      <div className="match-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="match-container">
      {/* Header */}
      <header className="match-header">
        <h1>{currentRoom.name}</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </header>

      {/* Main Content */}
      <div className="match-content">
        <div className="game-section">
          <Battlefield canvasRef={canvasRef} gameState={gameState} userId={user.id} />
          <ActionPanel gameActive={gameState.gameActive} onSpawnUnit={spawnUnit} />
        </div>

        <div className="sidebar">
          <StatsPanel gameState={gameState} players={currentRoom.players} userId={user.id} />

          {/* Ready Section */}
          {!gameState.gameActive ? (
            <>
              {/* Ready button for both host and players */}
              <button onClick={toggleReady} className={`ready-btn ${readyStatus[user.id] ? "active" : ""}`}>
                {readyStatus[user.id] ? "✓ Ready" : "Not Ready"}
              </button>

              {/* Host Start Button */}
              {isHost && (
                <button
                  onClick={startGame}
                  className="start-btn"
                  disabled={currentRoom.players?.length < 2 || !allReady}
                >
                  {currentRoom.players?.length < 2
                    ? "Waiting for players..."
                    : !allReady
                    ? "Waiting for ready..."
                    : "Start Game"}
                </button>
              )}

              {/* Players' readiness status */}
              <div className="players-ready">
                <h4>Ready Status:</h4>
                {currentRoom.players?.map((player) => (
                  <div key={player._id} className="player-ready">
                    <span>{player.username}</span>
                    <span className={readyStatus[player._id] ? "ready" : "not-ready"}>
                      {readyStatus[player._id] ? "✓" : "✗"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="game-info">
              <div className="timer">{Math.ceil(gameState.timeRemaining)}s</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
