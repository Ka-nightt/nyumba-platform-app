import { Link } from 'react-router-dom'
import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react'
import { formatPrice } from '../../utils'
import { useState } from 'react'
import { propertyApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(property.is_favorited)
  const [favId, setFavId]         = useState(property.favorite_id)

  const toggleFavorite = async e => {
    e.preventDefault()
    if (!user) { toast.error('Sign in to save properties'); return }
    try {
      if (favorited) {
        await propertyApi.removeFavorite(favId)
        setFavorited(false)
        toast.success('Removed from saved')
      } else {
        const { data } = await propertyApi.addFavorite(property.id)
        setFavorited(true)
        setFavId(data.id)
        toast.success('Saved!')
      }
      onFavoriteToggle?.()
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <Link to={`/properties/${property.id}`} className="card group block hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {property.primary_image ? (
          <img src={property.primary_image} alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        <button onClick={toggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform">
          <Heart size={16} className={favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
        {property.is_featured && (
          <span className="absolute top-3 left-3 badge bg-primary-600 text-white">Featured</span>
        )}
        <span className={`absolute bottom-3 left-3 badge ${
          property.listing_type === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          For {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{property.title}</h3>
          {property.avg_rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-500 ml-2 shrink-0">
              <Star size={12} className="fill-amber-500" /> {property.avg_rating}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={12} /> {property.city}, {property.county}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1"><Bed size={12} /> {property.bedrooms} bed</span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms} bath</span>
          )}
          {property.size_sqft && (
            <span className="flex items-center gap-1"><Square size={12} /> {property.size_sqft} sqft</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-600">
            {formatPrice(property.price, property.listing_type)}
          </span>
          <span className="text-xs text-gray-400">{property.agent_name}</span>
        </div>
      </div>
    </Link>
  )
}
