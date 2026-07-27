import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "1.25rem",
            color: "#6b7280"
        }}>
            Loading...
        </div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute