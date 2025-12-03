"use client"

import { useState } from "react"
import axios from "axios"
import "./Login.css"

const SERVER_URL = import.meta.env.VITE_API_URL;

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const { data } = await axios.post(`${SERVER_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        })
        onLogin(data.user, data.token)
      } else {
        if (formData.password !== formData.passwordConfirm) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }
        const { data } = await axios.post(`${SERVER_URL}/api/auth/register`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })
        onLogin(data.user, data.token)
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>BATTLEGAME</h1>
        <p className="subtitle">Multiplayer Battle Arena</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin)
              setFormData({ username: "", email: "", password: "", passwordConfirm: "" })
              setError("")
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}
