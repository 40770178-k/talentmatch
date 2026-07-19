import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function RecruiterJobs() {
    const { logout } = useAuth()
    const [jobs, setJobs] = useState([])
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        status: "open",
        skill_ids: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, skillsRes] = await Promise.all([
                    api.get("/jobs/"),
                    api.get("/skills/"),
                ])
                setJobs(jobsRes.data)
                setSkills(skillsRes.data)
            } catch {
                setError("Failed to load jobs.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const toggleSkill = (skillId) => {
        setFormData(prev => ({
            ...prev,
            skill_ids: prev.skill_ids.includes(skillId)
                ? prev.skill_ids.filter(id => id !== skillId)
                : [...prev.skill_ids, skillId],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")

        try {
            if (editingJob) {
                const response = await api.put(
                    `/jobs/${editingJob.id}/`,
                    formData
                )
                setJobs(jobs.map(j =>
                    j.id === editingJob.id ? response.data : j
                ))
                setMessage("Job updated successfully!")
            } else {
                const response = await api.post("/jobs/", formData)
                setJobs([...jobs, response.data])
                setMessage("Job created successfully!")
            }

            setShowForm(false)
            setEditingJob(null)
            setFormData({
                title: "",
                description: "",
                location: "",
                status: "open",
                skill_ids: [],
            })
        } catch {
            setError("Failed to save job.")
        }
    }

    const handleEdit = (job) => {
        setEditingJob(job)
        setFormData({
            title: job.title,
            description: job.description,
            location: job.location || "",
            status: job.status,
            skill_ids: job.required_skills?.map(s => s.id) || [],
        })
        setShowForm(true)
        window.scrollTo(0, 0)
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingJob(null)
        setFormData({
            title: "",
            description: "",
            location: "",
            status: "open",
            skill_ids: [],
        })
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
                    <Link
                        to="/recruiter/dashboard"
                        style={styles.navLink}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/recruiter/applications"
                        style={styles.navLink}
                    >
                        Applications
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
                <div style={styles.pageHeader}>
                    <h2 style={styles.pageTitle}>My Jobs</h2>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={styles.button}
                        >
                            + Post New Job
                        </button>
                    )}
                </div>

                {message && (
                    <div style={styles.success}>{message}</div>
                )}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {/* Job Form */}
                {showForm && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            {editingJob ? "Edit Job" : "Post New Job"}
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            style={styles.form}
                        >
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Job Title
                                </label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Junior Django Developer"
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Description
                                </label>
                                <textarea
                                    style={styles.textarea}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the role and requirements"
                                    rows={5}
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Location
                                </label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Nairobi, Kenya or Remote"
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Status</label>
                                <select
                                    style={styles.input}
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Required Skills
                                </label>
                                <div style={styles.skillsGrid}>
                                    {skills.map(skill => (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() =>
                                                toggleSkill(skill.id)
                                            }
                                            style={
                                                formData.skill_ids.includes(
                                                    skill.id
                                                )
                                                    ? styles.skillSelected
                                                    : styles.skillUnselected
                                            }
                                        >
                                            {skill.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    type="submit"
                                    style={styles.button}
                                >
                                    {editingJob
                                        ? "Update Job"
                                        : "Post Job"
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jobs List */}
                {jobs.length === 0 ? (
                    <div style={styles.empty}>
                        <p>You haven't posted any jobs yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            style={styles.button}
                        >
                            Post your first job
                        </button>
                    </div>
                ) : (
                    <div style={styles.jobList}>
                        {jobs.map(job => (
                            <div key={job.id} style={styles.jobCard}>
                                <div style={styles.jobHeader}>
                                    <div>
                                        <h3 style={styles.jobTitle}>
                                            {job.title}
                                        </h3>
                                        {job.location && (
                                            <p style={styles.jobLocation}>
                                                📍 {job.location}
                                            </p>
                                        )}
                                    </div>
                                    <span style={
                                        job.status === "open"
                                            ? styles.statusOpen
                                            : styles.statusClosed
                                    }>
                                        {job.status}
                                    </span>
                                </div>

                                <p style={styles.jobDescription}>
                                    {job.description.length > 150
                                        ? job.description.slice(0, 150)
                                            + "..."
                                        : job.description
                                    }
                                </p>

                                {job.required_skills?.length > 0 && (
                                    <div style={styles.skillTags}>
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

                                <div style={styles.jobFooter}>
                                    <p style={styles.jobDate}>
                                        Posted{" "}
                                        {new Date(
                                            job.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => handleEdit(job)}
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>
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
    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
    },
    pageTitle: {
        fontSize: "1.75rem",
        color: "#111827",
        margin: 0,
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
    card: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: "1.5rem",
    },
    cardTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        marginTop: 0,
        marginBottom: "1.5rem",
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
    textarea: {
        padding: "0.75rem",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        fontSize: "1rem",
        outline: "none",
        resize: "vertical",
    },
    skillsGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
    },
    skillSelected: {
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        border: "none",
        fontSize: "0.875rem",
        cursor: "pointer",
    },
    skillUnselected: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        border: "1px solid #d1d5db",
        fontSize: "0.875rem",
        cursor: "pointer",
    },
    formActions: {
        display: "flex",
        gap: "1rem",
    },
    button: {
        backgroundColor: "#1e40af",
        color: "white",
        padding: "0.75rem 1.5rem",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "transparent",
        color: "#6b7280",
        padding: "0.75rem 1.5rem",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
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
    jobList: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    jobCard: {
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    jobHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "0.75rem",
    },
    jobTitle: {
        fontSize: "1.125rem",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 0.25rem 0",
    },
    jobLocation: {
        color: "#6b7280",
        fontSize: "0.875rem",
        margin: 0,
    },
    statusOpen: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    statusClosed: {
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    jobDescription: {
        color: "#374151",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        marginBottom: "0.75rem",
    },
    skillTags: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1rem",
    },
    skillTag: {
        backgroundColor: "#eff6ff",
        color: "#1e40af",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "500",
    },
    jobFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #e5e7eb",
        paddingTop: "0.75rem",
    },
    jobDate: {
        color: "#6b7280",
        fontSize: "0.75rem",
        margin: 0,
    },
    editButton: {
        backgroundColor: "transparent",
        color: "#1e40af",
        border: "1px solid #1e40af",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
    },
}

export default RecruiterJobs