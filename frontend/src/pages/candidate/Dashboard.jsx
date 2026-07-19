import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function CandidateDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        interview: 0,
        accepted: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/applications/")
                const applications = response.data

                setStats({
                    total: applications.length,
                    pending: applications.filter(
                        a => a.status === "pending"
                    ).length,
                    interview: applications.filter(
                        a => a.status === "interview"
                    ).length,
                    accepted: applications.filter(
                        a => a.status === "accepted"
                    ).length,
                })
            } catch {
                setStats({
                    total: 0,
                    pending: 0,
                    interview: 0,
                    accepted: 0,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    if (loading) {
        return <div style={styles.loading}>Loading...</div>
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.nav}>
                <h1 style={styles.navTitle}>TalentMatch</h1>
                <div style={styles.navLinks}>
                    <Link to="/candidate/jobs" style={styles.navLink}>
                        Browse Jobs
                    </Link>
                    <Link to="/candidate/applications" style={styles.navLink}>
                        My Applications
                    </Link>
                    <Link to="/candidate/profile" style={styles.navLink}>
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.content}>
                <h2 style={styles.welcome}>
                    Welcome back, {user?.full_name || user?.username} 👋
                </h2>
                <p style={styles.subtitle}>
                    Here's your job search overview
                </p>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.total}</h3>
                        <p style={styles.statLabel}>Total Applications</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{stats.pending}</h3>
                        <p style={styles.statLabel}>Pending Review</p>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderTop: "4px solid #f59e0b"
                    }}>
                        <h3 style={styles.statNumber}>{stats.interview}</h3>
                        <p style={styles.statLabel}>Interview Stage</p>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderTop: "4px solid #10b981"
                    }}>
                        <h3 style={styles.statNumber}>{stats.accepted}</h3>
                        <p style={styles.statLabel}>Accepted</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.actions}>
                    <h3 style={styles.actionsTitle}>Quick Actions</h3>
                    <div style={styles.actionButtons}>
                        <Link to="/candidate/jobs" style={styles.actionButton}>
                            Browse Open Jobs
                        </Link>
                        <Link
                            to="/candidate/profile"
                            style={styles.actionButtonOutline}
                        >
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.25rem",
        color: "#6b7280",
    },
    nav: {
        backgroundColor: "#1e40af",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    navTitle: {
        color: "white",
        margin: 0,
        fontSize: "1.5rem",
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
    },
    navLink: {
        color: "white",
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: "500",
    },
    logoutButton: {
        backgroundColor: "transparent",
        color: "white",
        border: "1px solid white",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.875rem",
    },
    content: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
    },
    welcome: {
        fontSize: "1.75rem",
        color: "#111827",
        marginBottom: "0.25rem",
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: "2rem",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
    },
    statCard: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderTop: "4px solid #1e40af",
        textAlign: "center",
    },
    statNumber: {
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 0.5rem 0",
    },
    statLabel: {
        color: "#6b7280",
        margin: 0,
        fontSize: "0.875rem",
    },
    actions: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    actionsTitle: {
        color: "#111827",
        marginTop: 0,
        marginBottom: "1rem",
    },
    actionButtons: {
        display: "flex",
        gap: "1rem",
    },
    actionButton: {
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.875rem",
    },
    actionButtonOutline: {
        backgroundColor: "transparent",
        color: "#1e40af",
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "0.875rem",
        border: "2px solid #1e40af",
    },
}

export default CandidateDashboard