import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { propertyApi, bookingApi, reviewApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { useTrack } from '../hooks/useTrack'
import { formatPrice } from '../utils'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPin, Bed, Bath, Square, Wifi, Car, Dumbbell, Shield,
         Star, Calendar, Phone, User, Loader, Heart, ExternalLink } from 'lucide-react'

export default function PropertyDetailPage() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const { track }    = useTrack()
  const [activeImg, setActiveImg] = useState(0)
  const [bookingDate, setBookingDate] = useState(null)
  const [bookingTime, setBookingTime] = useState('10:00')
  const [bookingMsg,  setBookingMsg]  = useState('')
  const [booking, setBooking] = useState(false)

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.get(id).then(r => r.data)
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.list(id).then(r => r.data?.results || r.data || [])
  })

  useEffect(() => {
    if (property) track('property_view', { property_id: Number(id) })
  }, [property])

  const handleBooking = async () => {
    if (!user) { toast.error('Sign in to book a visit'); return }
    if (!bookingDate) { toast.error('Please select a date'); return }
    setBooking(true)
    try {
      await bookingApi.create({
        property: id,
        visit_date: bookingDate.toISOString().split('T')[0],
        visit_time: bookingTime,
        message: bookingMsg,
      })
      track('booking_created', { property_id: Number(id) })
      toast.success('Visit request sent! Agent will confirm.')
      setBookingDate(null)
    } catch {
      toast.error('Booking failed. Try again.')
    } finally {
      setBooking(false)
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader className="animate-spin text-primary-600" size={32} />
    </div>
  )
  if (!property) return <div className="text-center py-20">Property not found</div>

  const images = property.images || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700">Home</Link> /
        <Link to="/search" className="hover:text-gray-700 mx-1">Properties</Link> /
        <span className="text-gray-900 ml-1">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Image Gallery */}
          <div className="card overflow-hidden">
            {images.length > 0 ? (
              <>
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img src={images[activeImg]?.image || property.primary_image}
                    alt={property.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={img.id} onClick={() => setActiveImg(i)}
                        className={`w-16 h-12 rounded overflow-hidden shrink-0 ring-2 transition-all ${
                          i === activeImg ? 'ring-primary-500' : 'ring-transparent'}`}>
                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <span className={`badge ${property.listing_type === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                For {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
              <MapPin size={14} /> {property.address}, {property.city}, {property.county}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-4">
              {formatPrice(property.price, property.listing_type)}
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mb-6">
              {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={14} /> {property.bedrooms} Bedrooms</span>}
              {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms} Bathrooms</span>}
              {property.size_sqft && <span className="flex items-center gap-1"><Square size={14} /> {property.size_sqft} sqft</span>}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{property.description}</p>

            {/* Amenities */}
            <div className="grid grid-cols-2 gap-2">
              {[
                [property.is_furnished, '🛋️ Furnished'],
                [property.has_parking,  <><Car size={14} className="inline"/> Parking</>],
                [property.has_wifi,     <><Wifi size={14} className="inline"/> WiFi included</>],
                [property.has_gym,      <><Dumbbell size={14} className="inline"/> Gym</>],
                [property.has_pool,     '🏊 Swimming Pool'],
                [property.has_security, <><Shield size={14} className="inline"/> 24/7 Security</>],
              ].filter(([v]) => v).map(([, label], i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                  ✓ {label}
                </span>
              ))}
            </div>
          </div>

          {/* Map */}
          {property.latitude && property.longitude && (
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Location</h3>
              </div>
              <div className="h-64">
                <MapContainer center={[property.latitude, property.longitude]} zoom={15}
                  className="w-full h-full" scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap' />
                  <Marker position={[property.latitude, property.longitude]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Reviews {reviews?.length > 0 && `(${reviews.length})`}
            </h3>
            {reviews?.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews?.map(r => (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold">
                        {r.user_detail?.first_name?.[0]}
                      </div>
                      <span className="text-sm font-medium">{r.user_detail?.full_name}</span>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-9">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Agent Card */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Listed by</h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">{property.agent?.full_name}</p>
                <p className="text-xs text-gray-500">Property Agent</p>
              </div>
            </div>
            {property.agent?.phone && (
              <a href={`tel:${property.agent.phone}`}
                className="flex items-center gap-2 mt-4 text-sm text-primary-600 hover:underline"
                onClick={() => track('contact_agent', { property_id: Number(id) })}>
                <Phone size={14} /> {property.agent.phone}
              </a>
            )}
          </div>

          {/* Booking Card */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16} /> Book a Visit
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Date</label>
                <DatePicker selected={bookingDate} onChange={setBookingDate}
                  minDate={new Date()} className="input w-full" placeholderText="Choose a date" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Time</label>
                <select className="input" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                  {['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea className="input resize-none" rows={2} placeholder="Any specific questions..."
                  value={bookingMsg} onChange={e => setBookingMsg(e.target.value)} />
              </div>
              <button onClick={handleBooking} disabled={booking} className="btn-primary w-full">
                {booking ? 'Sending...' : 'Request Visit'}
              </button>
            </div>
          </div>

          {/* Virtual Tour */}
          {property.virtual_tour_url && (
            <a href={property.virtual_tour_url} target="_blank" rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <ExternalLink size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">View Virtual Tour</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
