// src/api/auth.js 
const BASE_URL = "http://94.74.86.174:8080/api"

// Login User Function 
export const loginUser = async (username, password) => {
  try {
    console.log("=== LOGIN DEBUG START ===")
    console.log("URL:", `${BASE_URL}/login`)
    console.log("Request body:", { username, password })

    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    console.log("Login response status:", response.status)
    console.log("Login response headers:", [...response.headers.entries()])

    const responseText = await response.text()
    console.log("Login raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Login failed: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || errorData.errorMessage || "Login failed")
    }

    // Parse response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error("Invalid JSON response from server")
    }

    console.log("Login parsed response:", data)
    console.log("Response structure:", JSON.stringify(data, null, 2))

    // Cari token - berdasarkan log , token ada di data.data.token
    let token = null

    if (data.data && data.data.token) {
      token = data.data.token
      console.log("Token found in data.data.token:", token)
    } else if (data.token) {
      token = data.token
      console.log("Token found in data.token:", token)
    }

    if (token) {
      localStorage.setItem("authToken", token)
      console.log("Token saved to localStorage:", token.substring(0, 20) + "...")
      console.log("=== LOGIN SUCCESS ===")
      return data
    } else {
      console.error("No token found in response. Full response:", data)
      throw new Error("Token not received. Login failed.")
    }
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

// Register User Function 
export const registerUser = async (email, username, password) => {
  try {
    // Format request sesuai PDF: email, password, username
    const requestBody = {
      email: email,
      password: password,
      username: username,
    }

    console.log("=== REGISTRATION DEBUG (PDF Format) ===")
    console.log("URL:", `${BASE_URL}/register`)
    console.log("Method: POST")
    console.log("Headers:", { "Content-Type": "application/json" })
    console.log("Request body:", requestBody)
    console.log("Body JSON:", JSON.stringify(requestBody))
    console.log("========================================")

    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Register response status:", response.status)
    console.log("Register response headers:", [...response.headers.entries()])

    const responseText = await response.text()
    console.log("Register raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Registration failed: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || errorData.errorMessage || "Registration failed")
    }

    const data = JSON.parse(responseText)
    console.log("Register parsed response:", data)

    return data
  } catch (error) {
    console.error("Error during registration:", error)
    throw error
  }
}

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem("authToken")
  console.log("User logged out, token removed")
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken")
  return !!token
}

// Get stored token
export const getToken = () => {
  return localStorage.getItem("authToken")
}

// Get Auth Headers untuk API yang memerlukan Bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken")
  if (!token) {
    throw new Error("No authentication token found. Please login.")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// API Request with Authentication (untuk endpoint yang butuh JWT)
export const apiRequest = async (method, endpoint, body = null) => {
  const token = localStorage.getItem("authToken")

  // Daftar endpoint yang tidak perlu token
  const publicEndpoints = ["/login", "/register"]
  const isPublicEndpoint = publicEndpoints.includes(endpoint)

  if (!token && !isPublicEndpoint) {
    throw new Error("No authentication token found. Please login.")
  }

  const headers = {
    "Content-Type": "application/json",
  }

  // Hanya tambahkan Authorization header jika bukan public endpoint dan ada token
  if (token && !isPublicEndpoint) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    console.log(`=== API REQUEST DEBUG ===`)
    console.log(`${method} ${BASE_URL}${endpoint}`)
    console.log("Headers:", headers)
    console.log("Body:", body)
    console.log("========================")

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    })

    const responseText = await response.text()
    console.log(`${method} ${endpoint} response:`, responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Server error: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || errorData.errorMessage || `API request to ${endpoint} failed`)
    }

    const data = JSON.parse(responseText)
    return data
  } catch (error) {
    console.error(`Error during ${method} request to ${endpoint}:`, error)
    throw error
  }
}


// (getAllChecklists, createChecklist, dll - tidak perlu diubah)

// 1. Get All Checklist
export const getAllChecklists = async () => {
  try {
    console.log("=== GET ALL CHECKLISTS ===")

    const response = await fetch(`${BASE_URL}/checklist`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    console.log("Get checklists response status:", response.status)

    const responseText = await response.text()
    console.log("Get checklists raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to fetch checklists: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to fetch checklists")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error fetching checklists:", error)
    throw error
  }
}

// 2. Create New Checklist
export const createChecklist = async (name) => {
  try {
    console.log("=== CREATE CHECKLIST ===")
    console.log("Checklist name:", name)

    const response = await fetch(`${BASE_URL}/checklist`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: name }),
    })

    console.log("Create checklist response status:", response.status)

    const responseText = await response.text()
    console.log("Create checklist raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to create checklist: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to create checklist")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error creating checklist:", error)
    throw error
  }
}

// 3. Delete Checklist by ID
export const deleteChecklist = async (checklistId) => {
  try {
    console.log("=== DELETE CHECKLIST ===")
    console.log("Checklist ID:", checklistId)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    console.log("Delete checklist response status:", response.status)

    const responseText = await response.text()
    console.log("Delete checklist raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to delete checklist: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to delete checklist")
    }

    return responseText ? JSON.parse(responseText) : { success: true }
  } catch (error) {
    console.error("Error deleting checklist:", error)
    throw error
  }
}

// === CHECKLIST ITEM API FUNCTIONS ===

// 1. Get All Checklist Items by Checklist ID
export const getChecklistItems = async (checklistId) => {
  try {
    console.log("=== GET CHECKLIST ITEMS ===")
    console.log("Checklist ID:", checklistId)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    console.log("Get checklist items response status:", response.status)

    const responseText = await response.text()
    console.log("Get checklist items raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to fetch checklist items: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to fetch checklist items")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    throw error
  }
}

// 2. Create New Checklist Item
export const createChecklistItem = async (checklistId, itemName) => {
  try {
    console.log("=== CREATE CHECKLIST ITEM ===")
    console.log("Checklist ID:", checklistId)
    console.log("Item name:", itemName)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemName: itemName }),
    })

    console.log("Create checklist item response status:", response.status)

    const responseText = await response.text()
    console.log("Create checklist item raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to create checklist item: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to create checklist item")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error creating checklist item:", error)
    throw error
  }
}

// 3. Get Specific Checklist Item
export const getChecklistItem = async (checklistId, checklistItemId) => {
  try {
    console.log("=== GET CHECKLIST ITEM ===")
    console.log("Checklist ID:", checklistId)
    console.log("Item ID:", checklistItemId)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item/${checklistItemId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    console.log("Get checklist item response status:", response.status)

    const responseText = await response.text()
    console.log("Get checklist item raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to fetch checklist item: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to fetch checklist item")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error fetching checklist item:", error)
    throw error
  }
}

// 4. Update Status Checklist Item
export const updateChecklistItemStatus = async (checklistId, checklistItemId) => {
  try {
    console.log("=== UPDATE CHECKLIST ITEM STATUS ===")
    console.log("Checklist ID:", checklistId)
    console.log("Item ID:", checklistItemId)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item/${checklistItemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    })

    console.log("Update checklist item status response status:", response.status)

    const responseText = await response.text()
    console.log("Update checklist item status raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to update checklist item status: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to update checklist item status")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error updating checklist item status:", error)
    throw error
  }
}

// 5. Delete Checklist Item
export const deleteChecklistItem = async (checklistId, checklistItemId) => {
  try {
    console.log("=== DELETE CHECKLIST ITEM ===")
    console.log("Checklist ID:", checklistId)
    console.log("Item ID:", checklistItemId)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item/${checklistItemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    console.log("Delete checklist item response status:", response.status)

    const responseText = await response.text()
    console.log("Delete checklist item raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to delete checklist item: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to delete checklist item")
    }

    return responseText ? JSON.parse(responseText) : { success: true }
  } catch (error) {
    console.error("Error deleting checklist item:", error)
    throw error
  }
}

// 6. Rename Checklist Item
export const renameChecklistItem = async (checklistId, checklistItemId, itemName) => {
  try {
    console.log("=== RENAME CHECKLIST ITEM ===")
    console.log("Checklist ID:", checklistId)
    console.log("Item ID:", checklistItemId)
    console.log("New item name:", itemName)

    const response = await fetch(`${BASE_URL}/checklist/${checklistId}/item/rename/${checklistItemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemName: itemName }),
    })

    console.log("Rename checklist item response status:", response.status)

    const responseText = await response.text()
    console.log("Rename checklist item raw response:", responseText)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Failed to rename checklist item: ${response.status} - ${responseText}`)
      }
      throw new Error(errorData.message || "Failed to rename checklist item")
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Error renaming checklist item:", error)
    throw error
  }
}
