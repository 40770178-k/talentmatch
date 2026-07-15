import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import api from "../services/api"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token")

            if (token) {
                try {
                    const response = await api.get("/candidates/profile/")
                    setUser({ role: "candidate", ...response.data })
                } catch {
                    try {
                        const response = await api.get(
                            "/candidates/recruiter/profile/"
                        )
                        setUser({ role: "recruiter", ...response.data })
                    } catch {
                        localStorage.removeItem("access_token")
                        localStorage.removeItem("refresh_token")
                        setUser(null)
                    }
                }
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    const login = async (username, password) => {
        const response = await api.post("/login/", { username, password })

        localStorage.setItem("access_token", response.data.access)
        localStorage.setItem("refresh_token", response.data.refresh)

        try {
            const profile = await api.get("/candidates/profile/")
            setUser({ role: "candidate", ...profile.data })
            return "candidate"
        } catch {
            const profile = await api.get("/candidates/recruiter/profile/")
            setUser({ role: "recruiter", ...profile.data })
            return "recruiter"
        }
    }

    const logout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}