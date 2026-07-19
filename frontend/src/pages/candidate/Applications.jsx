import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function CandidateApplications() {
    const { logout } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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

    const getStatusStyle = (status) => {
        const statusStyles = {
            pending: {
                backgroundColor: "#fef3c7",
                color: "#92400e"
            },
            reviewed: {
                backgroundColor: "#dbeafe",
                color: "#1e40af"
            },
            interview: {
                backgroundColor: "#ede9fe",
                color: "#5b21b6"
            },
            rejected: {
                backgroundColor: "#fee2e2",
                color: "#dc2626"
            },
            accepted: {
                backgroundColor: "#d1fae5",
                color: "#065f46"
            },
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
                    <Link to="/candidate/dashboard" style={styles.navLink}>
                        Dashboard
                    </Link>
                    <Link to="/candidate/jobs" style={styles.navLink}>
                        Browse Jobs
                    </Link>
                    <Link to="/candidate/profile" style={styles.navLink}>
                        Profile
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
                <h2 style={styles.pageTitle}>My Applications</h2>
                <p style={styles.subtitle}>
                    {applications.length} application
                    {applications.length !== 1 ? "s" : ""} total
                </p>

                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {applications.length === 0 ? (
                    <div style={styles.empty}>
                        <p>You haven't applied to any jobs yet.</p>
                        <Link
                            to="/candidate/jobs"
                            style={styles.browseLink}
                        >
                            Browse open jobs
                        </Link>
                    </div>
                ) : (
                    <div style={styles.applicationList}>
                        {applications.map(app => (
                            <div key={app.id} style={styles.appCard}>
                                <div style={styles.appHeader}>
                                    <div>
                                        <h3 style={styles.jobTitle}>
                                            {app.job_title}
                                        </h3>
                                        <p style={styles.appliedDate}>
                                            Applied{" "}
                                            {new Date(
                                                app.applied_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div style={styles.badges}>
                                        {/* Status Badge */}
                                        <span style={{
                                            ...styles.badge,
                                            ...getStatusStyle(app.status)
                                        }}>
                                            {app.status.charAt(0).toUpperCase()
                                                + app.status.slice(1)}
                                        </span>

                                        {/* Match Score Badge */}
                                        {app.match_score !== null && (
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: getScoreBackground(
                                                    app.match_score
                                                ),
                                                color: getScoreColor(
                                                    app.match_score
                                                ),
                                            }}>
                                                {app.match_score}% Match
                                            </span>
                                        )}
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
                                                        ✅ Matching Skills
                                                    </p>
                                                    <div style={styles.skillTags}>
                                                        {app.match_details
                                                            .matching_skills
                                                            .map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                style={
                                                                    styles.matchingTag
                                                                }
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {app.match_details.missing_skills
                                                ?.length > 0 && (
                                                <div style={styles.skillGroup}>
                                                    <p style={styles.skillLabel}>
                                                        ❌ Missing Skills
                                                    </p>
                                                    <div style={styles.skillTags}>
                                                        {app.match_details
                                                            .missing_skills
                                                            .map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                style={
                                                                    styles.missingTag
                                                                }
                                                            >
                                                                {skill}
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
    },
    browseLink: {
        display: "inline-block",
        marginTop: "1rem",
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "600",
    },
    applicationList: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
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
    jobTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 0.25rem 0",
    },
    appliedDate: {
        color: "#6b7280",
        fontSize: "0.875rem",
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
        paddingTop: "1rem",
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
}

export default CandidateApplications