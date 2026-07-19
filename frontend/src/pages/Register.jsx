import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "candidate",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await api.post("/register/", formData)
            navigate("/login")
        } catch (err) {
            const data = err.response?.data
            if (data) {
                const firstError = Object.values(data)[0]
                setError(Array.isArray(firstError) ? firstError[0] : firstError)
            } else {
                setError("Registration failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>TalentMatch</h1>
                <p style={styles.subtitle}>Create your account</p>

                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Choose a password"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>I am a</label>
                        <select
                            style={styles.input}
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="candidate">
                                Candidate (looking for work)
                            </option>
                            <option value="recruiter">
                                Recruiter (hiring)
                            </option>
                        </select>
                    </div>

                    <button
                        style={loading ? styles.buttonDisabled : styles.button}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p style={styles.loginText}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.link}>
                        Sign in here
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
    loginText: {
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

export default Register