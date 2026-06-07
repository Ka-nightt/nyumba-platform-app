import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { propertyApi } from '../api'
import PropertyCard from '../components/property/PropertyCard'
import { Search, MapPin, Shield, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: featured } = useQuery({
    queryKey: ['featured'],
    queryFn: () => propertyApi.featured().then(r => r.data)
  })
  const { data: recommended } = useQuery({
    queryKey: ['recommended'],
    queryFn: () => propertyApi.recommended().then(r => r.data)
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Home in Kenya</h1>
          <p className="text-primary-100 text-lg mb-8">Browse thousands of verified properties across all 47 counties</p>
          <div className="bg-white rounded-xl p-2 flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400" />
              <input className="flex-1 outline-none text-gray-900 text-sm"
                placeholder="City, estate, or property name..."
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/search?search=${search}`)} />
            </div>
            <button onClick={() => navigate(`/search?search=${search}`)}
              className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
              Search
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-primary-200">
            <Link to="/search?listing_type=rent" className="hover:text-white">🏠 For Rent</Link>
            <Link to="/search?listing_type=sale" className="hover:text-white">🏡 For Sale</Link>
            <Link to="/search?property_type=land" className="hover:text-white">🌿 Land</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {[['10,000+','Verified Listings'],['5,000+','Happy Tenants'],['500+','Trusted Agents']].map(([n,l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-primary-600">{n}</div>
              <div className="text-sm text-gray-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/search" className="text-primary-600 text-sm font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      {/* Recommended */}
      {recommended?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      {/* Why Nyumba */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Why Choose Nyumba?</h2>
          <p className="text-gray-500 mb-10">The easiest way to find, rent, or buy property in Kenya</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              [Shield, 'Verified Listings', 'Every property is reviewed and verified by our team before going live.'],
              [MapPin, 'Interactive Maps', 'Explore properties on a live map with precise locations and neighbourhood info.'],
              [TrendingUp, 'Mpesa Payments', 'Pay booking fees instantly via Mpesa — fast, safe, and familiar.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Are You a Property Agent?</h2>
        <p className="text-primary-100 mb-6">List your properties and reach thousands of verified buyers and renters.</p>
        <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
          Start Listing Today
        </Link>
      </section>
    </div>
  )
}
