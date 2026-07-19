import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

function CandidateProfile() {
    const { logout } = useAuth()
    const [profile, setProfile] = useState({
        full_name: "",
        location: "",
        bio: "",
        years_of_experience: 0,
        github_url: "",
        linkedin_url: "",
        skill_ids: [],
    })
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [resume, setResume] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [resumes, setResumes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, skillsRes, resumesRes] = await Promise.all([
                    api.get("/candidates/profile/"),
                    api.get("/skills/"),
                    api.get("/resumes/"),
                ])

                const profileData = profileRes.data
                setProfile({
                    full_name: profileData.full_name || "",
                    location: profileData.location || "",
                    bio: profileData.bio || "",
                    years_of_experience: profileData.years_of_experience || 0,
                    github_url: profileData.github_url || "",
                    linkedin_url: profileData.linkedin_url || "",
                    skill_ids: profileData.skills?.map(s => s.id) || [],
                })
                setSkills(skillsRes.data)
                setResumes(resumesRes.data)
            } catch {
                setError("Failed to load profile.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        })
    }

    const toggleSkill = (skillId) => {
        setProfile(prev => ({
            ...prev,
            skill_ids: prev.skill_ids.includes(skillId)
                ? prev.skill_ids.filter(id => id !== skillId)
                : [...prev.skill_ids, skillId],
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage("")
        setError("")

        try {
            await api.put("/candidates/profile/", profile)
            setMessage("Profile updated successfully!")
        } catch {
            setError("Failed to update profile.")
        } finally {
            setSaving(false)
        }
    }

    const handleResumeUpload = async (e) => {
        e.preventDefault()
        if (!resume) return

        setUploading(true)
        setMessage("")
        setError("")

        const formData = new FormData()
        formData.append("file", resume)

        try {
            await api.post("/resumes/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            setMessage("Resume uploaded successfully!")

            const resumesRes = await api.get("/resumes/")
            setResumes(resumesRes.data)
            setResume(null)
        } catch {
            setError("Failed to upload resume.")
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return <div style={styles.loading}>Loading profile...</div>
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
                    <Link to="/candidate/applications" style={styles.navLink}>
                        My Applications
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
                <h2 style={styles.pageTitle}>My Profile</h2>

                {message && (
                    <div style={styles.success}>{message}</div>
                )}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                <div style={styles.grid}>
                    {/* Profile Form */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            Personal Information
                        </h3>
                        <form onSubmit={handleSave} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Full Name
                                </label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="full_name"
                                    value={profile.full_name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
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
                                    value={profile.location}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Bio</label>
                                <textarea
                                    style={styles.textarea}
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    placeholder="Tell recruiters about yourself"
                                    rows={4}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Years of Experience
                                </label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    name="years_of_experience"
                                    value={profile.years_of_experience}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    GitHub URL
                                </label>
                                <input
                                    style={styles.input}
                                    type="url"
                                    name="github_url"
                                    value={profile.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    LinkedIn URL
                                </label>
                                <input
                                    style={styles.input}
                                    type="url"
                                    name="linkedin_url"
                                    value={profile.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            {/* Skills Selection */}
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Skills
                                </label>
                                <div style={styles.skillsGrid}>
                                    {skills.map(skill => (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() => toggleSkill(skill.id)}
                                            style={
                                                profile.skill_ids.includes(
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

                            <button
                                type="submit"
                                style={
                                    saving
                                        ? styles.buttonDisabled
                                        : styles.button
                                }
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </form>
                    </div>

                    {/* Resume Section */}
                    <div>
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Resume</h3>

                            <form
                                onSubmit={handleResumeUpload}
                                style={styles.form}
                            >
                                <div style={styles.field}>
                                    <label style={styles.label}>
                                        Upload Resume (PDF or DOCX)
                                    </label>
                                    <input
                                        style={styles.fileInput}
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={(e) =>
                                            setResume(e.target.files[0])
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={
                                        uploading || !resume
                                            ? styles.buttonDisabled
                                            : styles.button
                                    }
                                    disabled={uploading || !resume}
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Resume"
                                    }
                                </button>
                            </form>
                        </div>

                        {/* Resume History */}
                        {resumes.length > 0 && (
                            <div style={{
                                ...styles.card,
                                marginTop: "1rem"
                            }}>
                                <h3 style={styles.cardTitle}>
                                    Resume History
                                </h3>
                                <div style={styles.resumeList}>
                                    {resumes.map(r => (
                                        <div
                                            key={r.id}
                                            style={styles.resumeItem}
                                        >
                                            <div>
                                                <p style={styles.resumeName}>
                                                    {r.original_filename}
                                                </p>
                                                <p style={styles.resumeDate}>
                                                    {new Date(
                                                        r.uploaded_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {r.is_active && (
                                                <span style={styles.activeBadge}>
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
    pageTitle: {
        fontSize: "1.75rem",
        color: "#111827",
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
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        alignItems: "start",
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
    fileInput: {
        padding: "0.5rem 0",
        fontSize: "0.875rem",
        color: "#374151",
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
        fontWeight: "500",
        cursor: "pointer",
    },
    skillUnselected: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        border: "1px solid #d1d5db",
        fontSize: "0.875rem",
        fontWeight: "500",
        cursor: "pointer",
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
    },
    resumeList: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
    },
    resumeItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem",
        backgroundColor: "#f9fafb",
        borderRadius: "4px",
    },
    resumeName: {
        fontWeight: "600",
        color: "#111827",
        fontSize: "0.875rem",
        margin: 0,
    },
    resumeDate: {
        color: "#6b7280",
        fontSize: "0.75rem",
        margin: 0,
    },
    activeBadge: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
    },
}

export default CandidateProfile