import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { propertyApi } from '../api'
import PropertyCard from '../components/property/PropertyCard'
import SearchFilters from '../components/property/SearchFilters'
import { MapPin, Loader } from 'lucide-react'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()

  const filters = Object.fromEntries(params.entries())

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.list(filters).then(r => r.data)
  })

  const properties = data?.results || data || []
  const total      = data?.count   || properties.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchFilters onSearch={p => { setParams(p); refetch() }} />
      </div>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-900">
          {isLoading ? 'Searching...' : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
        </h1>
        <select className="input w-44 text-sm"
          value={params.get('ordering') || ''}
          onChange={e => { params.set('ordering', e.target.value); setParams(params) }}>
          <option value="">Most Recent</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-views_count">Most Viewed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-primary-600" size={32} />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  )
}
