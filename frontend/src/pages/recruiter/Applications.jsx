import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function RecruiterApplications() {
    const { logout } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications/")
                setApplications(response.data)
            } catch {
                setError("Failed to load applications.")
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdating(applicationId)
        setMessage("")
        setError("")

        try {
            const response = await api.patch(
                `/applications/${applicationId}/`,
                { status: newStatus }
            )
            setApplications(applications.map(app =>
                app.id === applicationId
                    ? { ...app, status: response.data.status }
                    : app
            ))
            setMessage("Application status updated.")
        } catch {
            setError("Failed to update status.")
        } finally {
            setUpdating(null)
        }
    }

    const getStatusStyle = (status) => {
        const statusStyles = {
            pending: { backgroundColor: "#fef3c7", color: "#92400e" },
            reviewed: { backgroundColor: "#dbeafe", color: "#1e40af" },
            interview: { backgroundColor: "#ede9fe", color: "#5b21b6" },
            rejected: { backgroundColor: "#fee2e2", color: "#dc2626" },
            accepted: { backgroundColor: "#d1fae5", color: "#065f46" },
        }
        return statusStyles[status] || statusStyles.pending
    }

    const getScoreColor = (score) => {
        if (score >= 75) return "#065f46"
        if (score >= 50) return "#92400e"
        return "#dc2626"
    }

    const getScoreBackground = (score) => {
        if (score >= 75) return "#d1fae5"
        if (score >= 50) return "#fef3c7"
        return "#fee2e2"
    }

    if (loading) {
        return <div style={styles.loading}>Loading applications...</div>
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.nav}>
                <h1 style={styles.navTitle}>TalentMatch</h1>
                <div style={styles.navLinks}>
                    <Link
                        to="/recruiter/dashboard"
                        style={styles.navLink}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/recruiter/jobs"
                        style={styles.navLink}
                    >
                        My Jobs
                    </Link>
                    <button
                        onClick={() => {
                            logout()
                            window.location.href = "/login"
                        }}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Applications</h2>
                <p style={styles.subtitle}>
                    {applications.length} application
                    {applications.length !== 1 ? "s" : ""} received
                </p>

                {message && (
                    <div style={styles.success}>{message}</div>
                )}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {applications.length === 0 ? (
                    <div style={styles.empty}>
                        <p>No applications received yet.</p>
                        <Link
                            to="/recruiter/jobs"
                            style={styles.actionButton}
                        >
                            View your jobs
                        </Link>
                    </div>
                ) : (
                    <div style={styles.appList}>
                        {applications.map(app => (
                            <div key={app.id} style={styles.appCard}>
                                {/* Card Header */}
                                <div style={styles.appHeader}>
                                    <div>
                                        <h3 style={styles.candidateName}>
                                            {app.candidate}
                                        </h3>
                                        <p style={styles.jobTitle}>
                                            Applied for:{" "}
                                            <strong>{app.job_title}</strong>
                                        </p>
                                        <p style={styles.appliedDate}>
                                            {new Date(
                                                app.applied_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div style={styles.badges}>
                                        {/* Match Score */}
                                        {app.match_score !== null && (
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor:
                                                    getScoreBackground(
                                                        app.match_score
                                                    ),
                                                color: getScoreColor(
                                                    app.match_score
                                                ),
                                            }}>
                                                {app.match_score}% Match
                                            </span>
                                        )}

                                        {/* Status Badge */}
                                        <span style={{
                                            ...styles.badge,
                                            ...getStatusStyle(app.status)
                                        }}>
                                            {app.status.charAt(0).toUpperCase()
                                                + app.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Match Details */}
                                {app.match_details && (
                                    <div style={styles.matchDetails}>
                                        {app.match_details.summary && (
                                            <p style={styles.summary}>
                                                {app.match_details.summary}
                                            </p>
                                        )}

                                        <div style={styles.skillsRow}>
                                            {app.match_details.matching_skills
                                                ?.length > 0 && (
                                                <div style={styles.skillGroup}>
                                                    <p style={styles.skillLabel}>
                                                        ✅ Matching
                                                    </p>
                                                    <div style={styles.skillTags}>
                                                        {app.match_details
                                                            .matching_skills
                                                            .map((s, i) => (
                                                            <span
                                                                key={i}
                                                                style={
                                                                    styles.matchingTag
                                                                }
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {app.match_details.missing_skills
                                                ?.length > 0 && (
                                                <div style={styles.skillGroup}>
                                                    <p style={styles.skillLabel}>
                                                        ❌ Missing
                                                    </p>
                                                    <div style={styles.skillTags}>
                                                        {app.match_details
                                                            .missing_skills
                                                            .map((s, i) => (
                                                            <span
                                                                key={i}
                                                                style={
                                                                    styles.missingTag
                                                                }
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {app.match_details.recommendation && (
                                            <p style={styles.recommendation}>
                                                AI Recommendation:{" "}
                                                <strong>
                                                    {app.match_details
                                                        .recommendation}
                                                </strong>
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Status Controls */}
                                <div style={styles.statusControls}>
                                    <p style={styles.statusLabel}>
                                        Update Status:
                                    </p>
                                    <div style={styles.statusButtons}>
                                        {[
                                            "pending",
                                            "reviewed",
                                            "interview",
                                            "rejected",
                                            "accepted",
                                        ].map(status => (
                                            <button
                                                key={status}
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        app.id,
                                                        status
                                                    )
                                                }
                                                disabled={
                                                    updating === app.id ||
                                                    app.status === status
                                                }
                                                style={
                                                    app.status === status
                                                        ? {
                                                            ...styles.statusBtn,
                                                            ...getStatusStyle(
                                                                status
                                                            ),
                                                            border: "2px solid currentColor",
                                                        }
                                                        : styles.statusBtn
                                                }
                                            >
                                                {status.charAt(0).toUpperCase()
                                                    + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
        marginBottom: "0.25rem",
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: "1.5rem",
    },
    success: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
    },
    error: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
    },
    empty: {
        textAlign: "center",
        padding: "4rem",
        color: "#6b7280",
        backgroundColor: "white",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
    appList: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    appCard: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    appHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem",
    },
    candidateName: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 0.25rem 0",
    },
    jobTitle: {
        color: "#6b7280",
        fontSize: "0.875rem",
        margin: "0 0 0.25rem 0",
    },
    appliedDate: {
        color: "#9ca3af",
        fontSize: "0.75rem",
        margin: 0,
    },
    badges: {
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    badge: {
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    matchDetails: {
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 0",
        marginBottom: "1rem",
    },
    summary: {
        color: "#374151",
        fontSize: "0.875rem",
        lineHeight: "1.6",
        marginBottom: "1rem",
    },
    skillsRow: {
        display: "flex",
        gap: "2rem",
        marginBottom: "0.75rem",
        flexWrap: "wrap",
    },
    skillGroup: {
        flex: 1,
    },
    skillLabel: {
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: "0.5rem",
    },
    skillTags: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
    },
    matchingTag: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "500",
    },
    missingTag: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "500",
    },
    recommendation: {
        fontSize: "0.875rem",
        color: "#374151",
        margin: 0,
    },
    statusControls: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
    },
    statusLabel: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#374151",
        margin: 0,
        whiteSpace: "nowrap",
    },
    statusButtons: {
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
    },
    statusBtn: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        padding: "0.4rem 0.875rem",
        border: "2px solid transparent",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        cursor: "pointer",
        textTransform: "capitalize",
    },
}

export default RecruiterApplications