import { useQuery, useQueryClient } from '@tanstack/react-query'
import { propertyApi } from '../api'
import PropertyCard from '../components/property/PropertyCard'
import { Heart, Loader } from 'lucide-react'

export default function FavoritesPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => propertyApi.favorites().then(r => (r.data?.results || r.data || []).map(f => ({
      ...f.property_detail, favorite_id: f.id, is_favorited: true
    })))
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart size={22} className="text-red-500 fill-red-500" /> Saved Properties
      </h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-primary-600" size={32} /></div>
      ) : !data?.length ? (
        <div className="text-center py-20 text-gray-500">
          <Heart size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No saved properties</p>
          <p className="text-sm">Browse properties and tap the heart icon to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.map(p => <PropertyCard key={p.id} property={p}
            onFavoriteToggle={() => queryClient.invalidateQueries(['favorites'])} />)}
        </div>
      )}
    </div>
  )
}
