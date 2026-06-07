import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { propertyApi, bookingApi, analyticsApi } from '../api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Plus, Home, Calendar, Eye, TrendingUp, Loader } from 'lucide-react'
import { formatPrice } from '../utils'

export default function AgentDashboard() {
  const { data: listings, isLoading: loadListings } = useQuery({
    queryKey: ['my_listings'],
    queryFn: () => propertyApi.myListings().then(r => r.data)
  })
  const { data: bookings } = useQuery({
    queryKey: ['agent_bookings'],
    queryFn: () => bookingApi.list().then(r => r.data?.results || r.data || [])
  })
  const { data: analytics } = useQuery({
    queryKey: ['analytics', 30],
    queryFn: () => analyticsApi.dashboard({ days: 30 }).then(r => r.data)
  })

  const totalViews    = listings?.reduce((s, p) => s + (p.views_count || 0), 0) || 0
  const activeListings = listings?.filter(p => p.status === 'active').length || 0
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0

  const chartData = analytics?.activity
    ?.filter(e => e.event_type === 'property_view')
    ?.reduce((acc, e) => {
      const d = acc.find(x => x.day === e.day)
      if (d) d.views += e.count
      else acc.push({ day: e.day, views: e.count })
      return acc
    }, []) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <Link to="/agent/listings/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          [Home, 'Active Listings', activeListings, 'text-blue-600', 'bg-blue-50'],
          [Eye, 'Total Views', totalViews, 'text-green-600', 'bg-green-50'],
          [Calendar, 'Pending Bookings', pendingBookings, 'text-amber-600', 'bg-amber-50'],
          [TrendingUp, 'Total Listings', listings?.length || 0, 'text-purple-600', 'bg-purple-50'],
        ].map(([Icon, label, val, tc, bg]) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={tc} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{val}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Property Views (30 days)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={d => d?.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#16a34a" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>}
        </div>

        {/* Recent Bookings */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Booking Requests</h3>
          {!bookings?.length ? (
            <p className="text-sm text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto">
              {bookings.slice(0, 8).map(b => (
                <div key={b.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{b.user_detail?.full_name || 'User'}</p>
                    <p className="text-gray-500 text-xs">{b.visit_date} at {b.visit_time}</p>
                  </div>
                  <span className={`badge text-xs ${
                    b.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listings Table */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">My Listings</h3>
        </div>
        {loadListings ? (
          <div className="flex justify-center py-12"><Loader className="animate-spin text-primary-600" size={24} /></div>
        ) : !listings?.length ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-3">No listings yet</p>
            <Link to="/agent/listings/new" className="btn-primary text-sm">Create your first listing</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Property</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Views</th>
                  <th className="px-5 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.title}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize">{p.property_type}</td>
                    <td className="px-5 py-3 text-primary-600 font-medium">{formatPrice(p.price, p.listing_type)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${
                        p.status === 'active'  ? 'bg-green-100 text-green-700' :
                        p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.views_count}</td>
                    <td className="px-5 py-3">
                      <Link to={`/properties/${p.id}`} className="text-primary-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
