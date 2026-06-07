import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FavoritesPage from './pages/FavoritesPage'
import BookingsPage from './pages/BookingsPage'
import AgentDashboard from './pages/AgentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'
import CreateListingPage from './pages/CreateListingPage'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/search"          element={<SearchPage />} />
          <Route path="/properties/:id"  element={<PropertyDetailPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/profile"         element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/favorites"       element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/bookings"        element={<PrivateRoute><BookingsPage /></PrivateRoute>} />
          <Route path="/agent/dashboard" element={<PrivateRoute roles={['agent']}><AgentDashboard /></PrivateRoute>} />
          <Route path="/agent/listings/new" element={<PrivateRoute roles={['agent']}><CreateListingPage /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
