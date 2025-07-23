"use client"

// src/components/LoginPage.js
import { useState } from "react"
import { loginUser } from "../api/auth"
import { useNavigate } from "react-router-dom"

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validasi input
    if (!username.trim()) {
      setError("Username tidak boleh kosong")
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError("Password tidak boleh kosong")
      setLoading(false)
      return
    }

    try {
      console.log("Attempting login with:", { username, password })

      const data = await loginUser(username, password)

      console.log("Login response:", data)

      // Handle berbagai kemungkinan response success
      if (data.statusCode === 2110 || data.statusCode === 2000 || data.success) {
        console.log("Login successful, calling onLogin callback")
        onLogin() // Callback untuk update state di App.js
      } else {
        setError(data.message || "Login failed.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "An unexpected error occurred during login.")
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    if (error) setError("")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError("")
  }

  // Handler untuk navigasi ke register
  const handleNavigateToRegister = (e) => {
    e.preventDefault()
    console.log("Navigating to register page...")
    navigate("/register")
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "50px auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Username: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
            placeholder="Masukkan username"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Password: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Masukkan password"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 15px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#0056b3"
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#007bff"
            }
          }}
        >
          {loading ? "Login..." : "Login"}
        </button>

        {error && (
          <div
            style={{
              color: "red",
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </form>

      {/* Link ke Register */}
      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Belum punya akun?{" "}
        <button
          onClick={handleNavigateToRegister}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "inherit",
            fontWeight: "bold",
            padding: 0,
          }}
          onMouseOver={(e) => {
            e.target.style.color = "#0056b3"
          }}
          onMouseOut={(e) => {
            e.target.style.color = "#007bff"
          }}
        >
          Daftar di sini
        </button>
      </p>
    </div>
  )
}

export default LoginPage
