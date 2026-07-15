import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const role = await login(username, password)

            if (role === "candidate") {
                navigate("/candidate/dashboard")
            } else {
                navigate("/recruiter/dashboard")
            }
        } catch {
            setError("Invalid username or password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>TalentMatch</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        style={loading ? styles.buttonDisabled : styles.button}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p style={styles.registerText}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.link}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
    },
    card: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        textAlign: "center",
        color: "#1e40af",
        marginBottom: "0.25rem",
    },
    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: "1.5rem",
    },
    error: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
        fontSize: "0.875rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
    label: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#374151",
    },
    input: {
        padding: "0.75rem",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        fontSize: "1rem",
        outline: "none",
    },
    button: {
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.75rem",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "0.5rem",
    },
    buttonDisabled: {
        backgroundColor: "#93c5fd",
        color: "white",
        padding: "0.75rem",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "not-allowed",
        marginTop: "0.5rem",
    },
    registerText: {
        textAlign: "center",
        marginTop: "1rem",
        fontSize: "0.875rem",
        color: "#6b7280",
    },
    link: {
        color: "#1e40af",
        textDecoration: "none",
        fontWeight: "600",
    },
}

export default Login