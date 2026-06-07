import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Home, Search, Heart, Calendar, LayoutDashboard, Menu, X, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              <Home size={24} /> Nyumba
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/search" className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium">
                <Search size={16} /> Browse
              </Link>
              {user && (
                <>
                  <Link to="/favorites" className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium">
                    <Heart size={16} /> Saved
                  </Link>
                  <Link to="/bookings" className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium">
                    <Calendar size={16} /> Bookings
                  </Link>
                </>
              )}
              {user?.role === 'agent' && (
                <Link to="/agent/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium">
                  <LayoutDashboard size={16} /> Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  {user.first_name}
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link to="/profile" onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={14} /> Profile
                    </Link>
                    {user.role === 'agent' && (
                      <Link to="/agent/listings/new" onClick={() => setDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        + New Listing
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/search" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Browse Properties</Link>
          {user ? (
            <>
              <Link to="/favorites" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Saved</Link>
              <Link to="/bookings"  onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Bookings</Link>
              <Link to="/profile"   onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Profile</Link>
              <button onClick={handleLogout} className="block py-2 text-sm text-red-600">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
