import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages (we'll create these next)
import Login from "./pages/Login"
import Register from "./pages/Register"
import CandidateDashboard from "./pages/candidate/Dashboard"
import JobList from "./pages/candidate/JobList"
import CandidateProfile from "./pages/candidate/Profile"
import CandidateApplications from "./pages/candidate/Applications"
import RecruiterDashboard from "./pages/recruiter/Dashboard"
import RecruiterJobs from "./pages/recruiter/Jobs"
import RecruiterApplications from "./pages/recruiter/Applications"
import Unauthorized from "./pages/Unauthorized"

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Candidate routes */}
            <Route path="/candidate/dashboard" element={
                <ProtectedRoute allowedRole="candidate">
                    <CandidateDashboard />
                </ProtectedRoute>
            } />
            <Route path="/candidate/jobs" element={
                <ProtectedRoute allowedRole="candidate">
                    <JobList />
                </ProtectedRoute>
            } />
            <Route path="/candidate/profile" element={
                <ProtectedRoute allowedRole="candidate">
                    <CandidateProfile />
                </ProtectedRoute>
            } />
            <Route path="/candidate/applications" element={
                <ProtectedRoute allowedRole="candidate">
                    <CandidateApplications />
                </ProtectedRoute>
            } />

            {/* Recruiter routes */}
            <Route path="/recruiter/dashboard" element={
                <ProtectedRoute allowedRole="recruiter">
                    <RecruiterDashboard />
                </ProtectedRoute>
            } />
            <Route path="/recruiter/jobs" element={
                <ProtectedRoute allowedRole="recruiter">
                    <RecruiterJobs />
                </ProtectedRoute>
            } />
            <Route path="/recruiter/applications" element={
                <ProtectedRoute allowedRole="recruiter">
                    <RecruiterApplications />
                </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default App