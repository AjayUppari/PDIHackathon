import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OrganizerHome from './pages/organizer/OrganizerHome';
import ReviewerDashboard from './components/ReviewerDashboard'
import ParticipantDashboard from './components/ParticipantDashboard'
import DraftsPage from './pages/organizer/DraftsPage';
import EventDetails from './pages/EventDetails';
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import SubmissionsPage from './pages/reviewer/SubmissionsPage'
import ResultsPage from './pages/results';

function App() {
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute requiredRole="Organizer">
                <OrganizerHome />
              </ProtectedRoute>
            }
          />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/organizer/drafts" element={<DraftsPage />} />
          <Route
            path="/reviewer"
            element={
              <ProtectedRoute requiredRole="Reviewer">
                <ReviewerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant"
            element={
              <ProtectedRoute requiredRole={null}>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviewer/submissions/:eventId"
            element={
              <ProtectedRoute requiredRole="Reviewer">
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:eventId"
            element={
              <ProtectedRoute requiredRole="Anyone">
                <ResultsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;