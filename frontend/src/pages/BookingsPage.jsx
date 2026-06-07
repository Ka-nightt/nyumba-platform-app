import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '../api'
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
}

export default function BookingsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.list().then(r => r.data?.results || r.data || [])
  })

  const cancelMutation = useMutation({
    mutationFn: id => bookingApi.update(id, { status: 'cancelled' }),
    onSuccess: () => { queryClient.invalidateQueries(['bookings']); toast.success('Booking cancelled') }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar size={22} /> My Bookings
      </h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-primary-600" size={32} /></div>
      ) : !data?.length ? (
        <div className="text-center py-20 text-gray-500">
          <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No bookings yet</p>
          <Link to="/search" className="text-primary-600 text-sm hover:underline">Browse properties to book a visit</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(b => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/properties/${b.property}`} className="font-semibold text-gray-900 hover:text-primary-600">
                    {b.property_detail?.title || `Property #${b.property}`}
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin size={13} /> {b.property_detail?.city}
                  </div>
                </div>
                <span className={`badge ${STATUS_STYLES[b.status]}`}>{b.status}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Calendar size={13} /> {b.visit_date}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {b.visit_time}</span>
              </div>
              {b.message && <p className="text-sm text-gray-500 mt-2 italic">"{b.message}"</p>}
              {b.status === 'pending' && (
                <button onClick={() => cancelMutation.mutate(b.id)}
                  className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                  <XCircle size={14} /> Cancel booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
