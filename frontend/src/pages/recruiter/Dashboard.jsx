import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function RecruiterDashboard() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/jobs/dashboard/")
                setStats(response.data)
            } catch {
                setError("Failed to load dashboard.")
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
        return <div style={styles.loading}>Loading dashboard...</div>
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.nav}>
                <h1 style={styles.navTitle}>TalentMatch</h1>
                <div style={styles.navLinks}>
                    <Link to="/recruiter/jobs" style={styles.navLink}>
                        My Jobs
                    </Link>
                    <Link to="/recruiter/applications" style={styles.navLink}>
                        Applications
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Recruiter Dashboard</h2>

                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {stats && (
                    <>
                        {/* Jobs Stats */}
                        <h3 style={styles.sectionTitle}>Jobs Overview</h3>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statNumber}>
                                    {stats.jobs.total}
                                </h3>
                                <p style={styles.statLabel}>Total Jobs</p>
                            </div>
                            <div style={{
                                ...styles.statCard,
                                borderTop: "4px solid #10b981"
                            }}>
                                <h3 style={styles.statNumber}>
                                    {stats.jobs.open}
                                </h3>
                                <p style={styles.statLabel}>Open Jobs</p>
                            </div>
                            <div style={{
                                ...styles.statCard,
                                borderTop: "4px solid #6b7280"
                            }}>
                                <h3 style={styles.statNumber}>
                                    {stats.jobs.closed}
                                </h3>
                                <p style={styles.statLabel}>Closed Jobs</p>
                            </div>
                        </div>

                        {/* Applications Stats */}
                        <h3 style={styles.sectionTitle}>
                            Applications Overview
                        </h3>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statNumber}>
                                    {stats.applications.total}
                                </h3>
                                <p style={styles.statLabel}>
                                    Total Applications
                                </p>
                            </div>
                            <div style={{
                                ...styles.statCard,
                                borderTop: "4px solid #f59e0b"
                            }}>
                                <h3 style={styles.statNumber}>
                                    {stats.applications.pending}
                                </h3>
                                <p style={styles.statLabel}>Pending</p>
                            </div>
                            <div style={{
                                ...styles.statCard,
                                borderTop: "4px solid #8b5cf6"
                            }}>
                                <h3 style={styles.statNumber}>
                                    {stats.applications.interview}
                                </h3>
                                <p style={styles.statLabel}>Interview</p>
                            </div>
                            <div style={{
                                ...styles.statCard,
                                borderTop: "4px solid #10b981"
                            }}>
                                <h3 style={styles.statNumber}>
                                    {stats.applications.accepted}
                                </h3>
                                <p style={styles.statLabel}>Accepted</p>
                            </div>
                        </div>

                        {/* Top Jobs */}
                        {stats.top_jobs?.length > 0 && (
                            <>
                                <h3 style={styles.sectionTitle}>
                                    Top Jobs by Applications
                                </h3>
                                <div style={styles.card}>
                                    {stats.top_jobs.map(job => (
                                        <div
                                            key={job.id}
                                            style={styles.jobRow}
                                        >
                                            <div>
                                                <p style={styles.jobTitle}>
                                                    {job.title}
                                                </p>
                                                <p style={styles.jobStatus}>
                                                    {job.status}
                                                </p>
                                            </div>
                                            <span style={styles.appCount}>
                                                {job.application_count}{" "}
                                                application
                                                {job.application_count !== 1
                                                    ? "s"
                                                    : ""
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Quick Actions */}
                        <div style={{
                            ...styles.card,
                            marginTop: "1.5rem"
                        }}>
                            <h3 style={styles.cardTitle}>Quick Actions</h3>
                            <div style={styles.actionButtons}>
                                <Link
                                    to="/recruiter/jobs"
                                    style={styles.actionButton}
                                >
                                    Manage Jobs
                                </Link>
                                <Link
                                    to="/recruiter/applications"
                                    style={styles.actionButtonOutline}
                                >
                                    Review Applications
                                </Link>
                            </div>
                        </div>
                    </>
                )}
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
    pageTitle: {
        fontSize: "1.75rem",
        color: "#111827",
        marginBottom: "1.5rem",
    },
    sectionTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "1rem",
        marginTop: "1.5rem",
    },
    error: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "1rem",
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
    card: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    cardTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        marginTop: 0,
        marginBottom: "1rem",
    },
    jobRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 0",
        borderBottom: "1px solid #e5e7eb",
    },
    jobTitle: {
        fontWeight: "600",
        color: "#111827",
        margin: 0,
        fontSize: "0.875rem",
    },
    jobStatus: {
        color: "#6b7280",
        fontSize: "0.75rem",
        margin: 0,
        textTransform: "capitalize",
    },
    appCount: {
        backgroundColor: "#eff6ff",
        color: "#1e40af",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
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

export default RecruiterDashboard