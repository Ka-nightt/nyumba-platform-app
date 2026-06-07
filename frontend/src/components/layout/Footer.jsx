import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Home size={20} /> Nyumba
          </div>
          <p className="text-sm">Kenya's premier property marketplace. Find your perfect home or investment.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Renters</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?listing_type=rent" className="hover:text-white">Rental Properties</Link></li>
            <li><Link to="/search" className="hover:text-white">Search All</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Buyers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?listing_type=sale" className="hover:text-white">Properties for Sale</Link></li>
            <li><Link to="/register" className="hover:text-white">Create Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Agents</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white">List a Property</Link></li>
            <li><Link to="/agent/dashboard" className="hover:text-white">Agent Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        © {new Date().getFullYear()} Nyumba. All rights reserved. Built in Kenya 🇰🇪
      </div>
    </footer>
  )
}
