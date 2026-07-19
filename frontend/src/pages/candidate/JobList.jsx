import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function JobList() {
    const { logout } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(null)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/")
                setJobs(response.data)
            } catch {
                setError("Failed to load jobs.")
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    const handleApply = async (jobId) => {
        setApplying(jobId)
        setMessage("")
        setError("")

        try {
            await api.post("/applications/", { job: jobId })
            setMessage("Application submitted successfully!")
        } catch (err) {
            const data = err.response?.data
            if (err.response?.status === 400) {
                setError("You have already applied to this job.")
            } else {
                setError(data?.detail || "Failed to apply. Please try again.")
            }
        } finally {
            setApplying(null)
        }
    }

    if (loading) {
        return <div style={styles.loading}>Loading jobs...</div>
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
                    <Link to="/candidate/applications" style={styles.navLink}>
                        My Applications
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
                <h2 style={styles.pageTitle}>Open Jobs</h2>
                <p style={styles.subtitle}>
                    {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
                </p>

                {message && (
                    <div style={styles.success}>{message}</div>
                )}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {jobs.length === 0 ? (
                    <div style={styles.empty}>
                        <p>No open jobs available right now.</p>
                        <p>Check back soon!</p>
                    </div>
                ) : (
                    <div style={styles.jobGrid}>
                        {jobs.map(job => (
                            <div key={job.id} style={styles.jobCard}>
                                <div style={styles.jobHeader}>
                                    <h3 style={styles.jobTitle}>
                                        {job.title}
                                    </h3>
                                    <span style={styles.jobStatus}>
                                        {job.status}
                                    </span>
                                </div>

                                <p style={styles.jobRecruiter}>
                                    Posted by {job.recruiter}
                                </p>

                                {job.location && (
                                    <p style={styles.jobLocation}>
                                        📍 {job.location}
                                    </p>
                                )}

                                <p style={styles.jobDescription}>
                                    {job.description.length > 150
                                        ? job.description.slice(0, 150) + "..."
                                        : job.description
                                    }
                                </p>

                                {job.required_skills?.length > 0 && (
                                    <div style={styles.skillsContainer}>
                                        {job.required_skills.map(skill => (
                                            <span
                                                key={skill.id}
                                                style={styles.skillTag}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button
                                    style={
                                        applying === job.id
                                            ? styles.buttonDisabled
                                            : styles.applyButton
                                    }
                                    onClick={() => handleApply(job.id)}
                                    disabled={applying === job.id}
                                >
                                    {applying === job.id
                                        ? "Applying..."
                                        : "Apply Now"
                                    }
                                </button>
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
    },
    jobGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "1.5rem",
    },
    jobCard: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
    },
    jobHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    jobTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        margin: 0,
    },
    jobStatus: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    jobRecruiter: {
        color: "#6b7280",
        fontSize: "0.875rem",
        margin: 0,
    },
    jobLocation: {
        color: "#6b7280",
        fontSize: "0.875rem",
        margin: 0,
    },
    jobDescription: {
        color: "#374151",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        margin: 0,
    },
    skillsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
    },
    skillTag: {
        backgroundColor: "#eff6ff",
        color: "#1e40af",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "500",
    },
    applyButton: {
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.75rem",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "auto",
    },
    buttonDisabled: {
        backgroundColor: "#93c5fd",
        color: "white",
        padding: "0.75rem",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "not-allowed",
        marginTop: "auto",
    },
}

export default JobList