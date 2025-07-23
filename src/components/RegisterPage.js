"use client"

// src/components/RegisterPage.js - Perbaikan routing
import { useState } from "react"
import { registerUser } from "../api/auth"
import { useNavigate } from "react-router-dom"

const RegisterPage = () => {
  // State sesuai dokumentasi PDF (email, username, password)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    // Validasi input
    if (!email.trim()) {
      setError("Email tidak boleh kosong")
      setLoading(false)
      return
    }

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

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid")
      setLoading(false)
      return
    }

    if (password.length < 3) {
      setError("Password minimal 3 karakter")
      setLoading(false)
      return
    }

    try {
      console.log("Attempting registration with:", { email, username, password })

      // Panggil registerUser dengan email, username, password (sesuai PDF)
      const data = await registerUser(email, username, password)

      console.log("Registration response:", data)

      // Handle berbagai kemungkinan response success
      if (data.statusCode === 2110 || data.statusCode === 2000 || data.success) {
        setMessage("Pendaftaran berhasil! Silakan login.")
        setEmail("")
        setUsername("")
        setPassword("")

        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.message || "Registration failed.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "An unexpected error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    if (error) setError("")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError("")
  }

  // Handler untuk navigasi ke login - PERBAIKAN DI SINI
  const handleNavigateToLogin = (e) => {
    e.preventDefault()
    console.log("Navigating to login page...")
    navigate("/login")
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
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Daftar Akun Baru</h2>

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
            Email: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Masukkan email"
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
            backgroundColor: loading ? "#6c757d" : "#28a745",
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
              e.target.style.backgroundColor = "#218838"
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#28a745"
            }
          }}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        {message && (
          <div
            style={{
              color: "green",
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

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

      {/* PERBAIKAN LINK KE LOGIN */}
      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Sudah punya akun?{" "}
        <button
          onClick={handleNavigateToLogin}
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
          Login di sini
        </button>
      </p>
    </div>
  )
}

export default RegisterPage
