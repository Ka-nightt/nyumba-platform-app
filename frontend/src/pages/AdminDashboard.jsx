import { useQuery } from '@tanstack/react-query'
import { analyticsApi, propertyApi } from '../api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
         CartesianGrid, Legend, AreaChart, Area } from 'recharts'
import { Users, Home, Eye, TrendingUp, Loader } from 'lucide-react'

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin_analytics'],
    queryFn: () => analyticsApi.dashboard({ days: 30 }).then(r => r.data)
  })

  // Build daily chart data merging all event types
  const dailyData = {}
  analytics?.activity?.forEach(e => {
    const d = e.day
    if (!dailyData[d]) dailyData[d] = { day: d, views: 0, searches: 0, bookings: 0, signups: 0 }
    if (e.event_type === 'property_view')   dailyData[d].views    += e.count
    if (e.event_type === 'search')          dailyData[d].searches += e.count
    if (e.event_type === 'booking_created') dailyData[d].bookings += e.count
    if (e.event_type === 'user_signup')     dailyData[d].signups  += e.count
  })
  const chartData = Object.values(dailyData).sort((a,b) => a.day.localeCompare(b.day))

  const totals = analytics?.event_totals || []
  const get = key => totals.find(e => e.event_type === key)?.count || 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-primary-600" size={32} /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              [Eye,       'Property Views', get('property_view'),   'text-blue-600',   'bg-blue-50'],
              [Users,     'New Signups',    get('user_signup'),     'text-green-600',  'bg-green-50'],
              [TrendingUp,'Searches',       get('search'),          'text-purple-600', 'bg-purple-50'],
              [Home,      'Bookings',       get('booking_created'), 'text-amber-600',  'bg-amber-50'],
            ].map(([Icon, label, val, tc, bg]) => (
              <div key={label} className="card p-5">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={tc} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{val.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{label} (30d)</p>
              </div>
            ))}
          </div>

          {/* Activity area chart */}
          <div className="card p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">User Activity — Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  {[['views','#2563eb'],['searches','#7c3aed'],['bookings','#d97706'],['signups','#16a34a']].map(([k,c]) => (
                    <linearGradient key={k} id={`g_${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={d => d?.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="views"    stroke="#2563eb" fill="url(#g_views)"    strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="searches" stroke="#7c3aed" fill="url(#g_searches)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="bookings" stroke="#d97706" fill="url(#g_bookings)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="signups"  stroke="#16a34a" fill="url(#g_signups)"  strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top properties */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Most Viewed Properties (30 days)</h3>
            {!analytics?.top_properties?.length ? (
              <p className="text-sm text-gray-500">No data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.top_properties.map((p, i) => (
                  <div key={p.property__id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold flex items-center justify-center text-gray-500">{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.property__title}</p>
                      <p className="text-xs text-gray-400">{p.property__city}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${Math.round(p.views / analytics.top_properties[0].views * 100)}px` }}></div>
                      <span className="text-sm font-semibold text-gray-700 w-12 text-right">{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
