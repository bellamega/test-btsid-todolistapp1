"use client"

// src/App.js
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import Dashboard from "./components/Dashboard"
import { isAuthenticated } from "./api/auth"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication status saat app dimuat
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      console.log("Authentication check:", authenticated)
      setIsLoggedIn(authenticated)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    console.log("Login successful, updating app state")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    console.log("Logout, updating app state")
    setIsLoggedIn(false)
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
