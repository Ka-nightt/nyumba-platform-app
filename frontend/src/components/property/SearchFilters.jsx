import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { COUNTIES, PROPERTY_TYPES } from '../../utils'

export default function SearchFilters({ onSearch }) {
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    search:       params.get('search')       || '',
    listing_type: params.get('listing_type') || '',
    property_type:params.get('property_type')|| '',
    city:         params.get('city')         || '',
    min_price:    params.get('min_price')    || '',
    max_price:    params.get('max_price')    || '',
    min_beds:     params.get('min_beds')     || '',
    is_furnished: params.get('is_furnished') || '',
    has_parking:  params.get('has_parking')  || '',
  })

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const apply = () => {
    const p = {}
    Object.entries(filters).forEach(([k,v]) => { if (v) p[k] = v })
    setParams(p)
    onSearch?.(p)
    setOpen(false)
  }

  const clear = () => {
    const empty = Object.fromEntries(Object.keys(filters).map(k => [k, '']))
    setFilters(empty)
    setParams({})
    onSearch?.({})
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search by title, city, area..."
            value={filters.search} onChange={e => set('search', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apply()} />
        </div>
        <select className="input w-36" value={filters.listing_type}
          onChange={e => set('listing_type', e.target.value)}>
          <option value="">All types</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
        <button onClick={() => setOpen(!open)}
          className="btn-secondary flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <button onClick={apply} className="btn-primary">Search</button>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Property Type</label>
            <select className="input" value={filters.property_type}
              onChange={e => set('property_type', e.target.value)}>
              <option value="">Any</option>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">County</label>
            <select className="input" value={filters.city}
              onChange={e => set('city', e.target.value)}>
              <option value="">Any</option>
              {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Price (KES)</label>
            <input className="input" type="number" placeholder="0"
              value={filters.min_price} onChange={e => set('min_price', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Price (KES)</label>
            <input className="input" type="number" placeholder="Any"
              value={filters.max_price} onChange={e => set('max_price', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Bedrooms</label>
            <select className="input" value={filters.min_beds}
              onChange={e => set('min_beds', e.target.value)}>
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <input type="checkbox" checked={filters.is_furnished === 'true'}
                onChange={e => set('is_furnished', e.target.checked ? 'true' : '')} />
              Furnished
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <input type="checkbox" checked={filters.has_parking === 'true'}
                onChange={e => set('has_parking', e.target.checked ? 'true' : '')} />
              Parking
            </label>
          </div>
          <div className="col-span-2 md:col-span-4 flex gap-2 justify-end">
            <button onClick={clear} className="btn-secondary flex items-center gap-1 text-sm">
              <X size={14} /> Clear filters
            </button>
            <button onClick={apply} className="btn-primary text-sm">Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}
