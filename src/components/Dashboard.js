"use client"

// src/components/Dashboard.js
import { useState, useEffect } from "react"
import {
  getAllChecklists,
  createChecklist,
  deleteChecklist,
  getChecklistItems,
  createChecklistItem,
  updateChecklistItemStatus,
  deleteChecklistItem,
  renameChecklistItem,
  logoutUser,
} from "../api/auth"

const Dashboard = ({ onLogout }) => {
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newChecklistName, setNewChecklistName] = useState("")
  const [selectedChecklist, setSelectedChecklist] = useState(null)
  const [checklistItems, setChecklistItems] = useState([])
  const [newItemName, setNewItemName] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [editItemName, setEditItemName] = useState("")

  // Fetch checklists saat component mount
  useEffect(() => {
    fetchChecklists()
  }, [])

  // Fetch semua checklist
  const fetchChecklists = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await getAllChecklists()
      console.log("Checklists response:", response)

      // Handle berbagai format response
      if (response.data && Array.isArray(response.data)) {
        setChecklists(response.data)
      } else if (Array.isArray(response)) {
        setChecklists(response)
      } else {
        setChecklists([])
      }
    } catch (error) {
      console.error("Gagal mengambil daftar checklist:", error.message)
      setError("Gagal mengambil daftar checklist: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Buat checklist baru
  const handleCreateChecklist = async () => {
    if (!newChecklistName.trim()) {
      setError("Nama checklist tidak boleh kosong")
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await createChecklist(newChecklistName)
      console.log("New checklist created:", response)

      setNewChecklistName("")
      await fetchChecklists() // Refresh daftar checklist
    } catch (error) {
      console.error("Gagal membuat checklist:", error.message)
      setError("Gagal membuat checklist: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Hapus checklist
  const handleDeleteChecklist = async (checklistId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus checklist ini?")) {
      return
    }

    try {
      setLoading(true)
      setError("")
      await deleteChecklist(checklistId)
      console.log("Checklist deleted:", checklistId)

      // Jika checklist yang dihapus sedang dipilih, reset selection
      if (selectedChecklist && selectedChecklist.id === checklistId) {
        setSelectedChecklist(null)
        setChecklistItems([])
      }

      await fetchChecklists() // Refresh daftar checklist
    } catch (error) {
      console.error("Gagal menghapus checklist:", error.message)
      setError("Gagal menghapus checklist: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Pilih checklist dan fetch items
  const handleSelectChecklist = async (checklist) => {
    try {
      setLoading(true)
      setError("")
      setSelectedChecklist(checklist)

      const response = await getChecklistItems(checklist.id)
      console.log("Checklist items response:", response)

      // Handle berbagai format response
      if (response.data && Array.isArray(response.data)) {
        setChecklistItems(response.data)
      } else if (Array.isArray(response)) {
        setChecklistItems(response)
      } else {
        setChecklistItems([])
      }
    } catch (error) {
      console.error("Gagal mengambil items checklist:", error.message)
      setError("Gagal mengambil items checklist: " + error.message)
      setChecklistItems([])
    } finally {
      setLoading(false)
    }
  }

  // Buat item baru dalam checklist
  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      setError("Nama item tidak boleh kosong")
      return
    }

    if (!selectedChecklist) {
      setError("Pilih checklist terlebih dahulu")
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await createChecklistItem(selectedChecklist.id, newItemName)
      console.log("New item created:", response)

      setNewItemName("")
      await handleSelectChecklist(selectedChecklist) // Refresh items
    } catch (error) {
      console.error("Gagal membuat item:", error.message)
      setError("Gagal membuat item: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Update status item (toggle completed)
  const handleToggleItemStatus = async (item) => {
    try {
      setLoading(true)
      setError("")
      const response = await updateChecklistItemStatus(selectedChecklist.id, item.id)
      console.log("Item status updated:", response)

      await handleSelectChecklist(selectedChecklist) // Refresh items
    } catch (error) {
      console.error("Gagal mengubah status item:", error.message)
      setError("Gagal mengubah status item: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Hapus item
  const handleDeleteItem = async (item) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      return
    }

    try {
      setLoading(true)
      setError("")
      await deleteChecklistItem(selectedChecklist.id, item.id)
      console.log("Item deleted:", item.id)

      await handleSelectChecklist(selectedChecklist) // Refresh items
    } catch (error) {
      console.error("Gagal menghapus item:", error.message)
      setError("Gagal menghapus item: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Mulai edit item
  const handleStartEditItem = (item) => {
    setEditingItem(item)
    setEditItemName(item.name || item.itemName || "")
  }

  // Simpan edit item
  const handleSaveEditItem = async () => {
    if (!editItemName.trim()) {
      setError("Nama item tidak boleh kosong")
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await renameChecklistItem(selectedChecklist.id, editingItem.id, editItemName)
      console.log("Item renamed:", response)

      setEditingItem(null)
      setEditItemName("")
      await handleSelectChecklist(selectedChecklist) // Refresh items
    } catch (error) {
      console.error("Gagal mengubah nama item:", error.message)
      setError("Gagal mengubah nama item: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Cancel edit item
  const handleCancelEditItem = () => {
    setEditingItem(null)
    setEditItemName("")
  }

  // Handle logout
  const handleLogout = () => {
    logoutUser()
    onLogout()
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #f0f0f0",
          paddingBottom: "20px",
        }}
      >
        <h2 style={{ color: "#333", margin: 0 }}>Dashboard To-Do List</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div
          style={{
            color: "#007bff",
            backgroundColor: "#d1ecf1",
            border: "1px solid #bee5eb",
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left Panel - Checklists */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>Daftar Checklist</h3>

          {/* Create New Checklist */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Buat Checklist Baru</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
                placeholder="Nama checklist..."
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
                onKeyPress={(e) => e.key === "Enter" && handleCreateChecklist()}
              />
              <button
                onClick={handleCreateChecklist}
                disabled={loading}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Buat
              </button>
            </div>
          </div>

          {/* Checklists List */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {checklists.length === 0 ? (
              <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
                Belum ada checklist. Buat checklist pertama Anda!
              </p>
            ) : (
              checklists.map((checklist) => (
                <div
                  key={checklist.id}
                  style={{
                    padding: "15px",
                    margin: "10px 0",
                    border: selectedChecklist?.id === checklist.id ? "2px solid #007bff" : "1px solid #ddd",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: selectedChecklist?.id === checklist.id ? "#e3f2fd" : "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => handleSelectChecklist(checklist)}
                >
                  <span style={{ fontWeight: "bold", color: "#333" }}>{checklist.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChecklist(checklist.id)
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Checklist Items */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {selectedChecklist ? (
            <>
              <h3 style={{ color: "#333", marginBottom: "20px" }}>Items dalam "{selectedChecklist.name}"</h3>

              {/* Create New Item */}
              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Tambah Item Baru</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nama item..."
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleCreateItem()}
                  />
                  <button
                    onClick={handleCreateItem}
                    disabled={loading}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {checklistItems.length === 0 ? (
                  <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
                    Belum ada item dalam checklist ini. Tambahkan item pertama!
                  </p>
                ) : (
                  checklistItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "15px",
                        margin: "10px 0",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        backgroundColor: item.itemCompletionStatus ? "#d4edda" : "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={item.itemCompletionStatus || false}
                          onChange={() => handleToggleItemStatus(item)}
                          style={{ cursor: "pointer" }}
                        />
                        {editingItem?.id === item.id ? (
                          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                            <input
                              type="text"
                              value={editItemName}
                              onChange={(e) => setEditItemName(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "3px",
                              }}
                              onKeyPress={(e) => e.key === "Enter" && handleSaveEditItem()}
                            />
                            <button
                              onClick={handleSaveEditItem}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Simpan
                            </button>
                            <button
                              onClick={handleCancelEditItem}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              textDecoration: item.itemCompletionStatus ? "line-through" : "none",
                              color: item.itemCompletionStatus ? "#6c757d" : "#333",
                              flex: 1,
                            }}
                          >
                            {item.name || item.itemName}
                          </span>
                        )}
                      </div>
                      {editingItem?.id !== item.id && (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => handleStartEditItem(item)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#ffc107",
                              color: "black",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#666",
                border: "2px dashed #ddd",
                borderRadius: "5px",
              }}
            >
              <h3>Pilih Checklist</h3>
              <p>Pilih checklist dari panel kiri untuk melihat dan mengelola items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
