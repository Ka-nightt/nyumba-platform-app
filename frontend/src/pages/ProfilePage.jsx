import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import toast from 'react-hot-toast'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { first_name: user?.first_name, last_name: user?.last_name, phone: user?.phone, bio: user?.bio }
  })

  const onSubmit = async data => {
    try {
      const res = await authApi.updateProfile(data)
      updateUser(res.data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><User size={22}/> My Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-primary-100 text-primary-700 mt-1">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('first_name')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name')} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input {...register('phone')} className="input" placeholder="+254 7XX XXX XXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea {...register('bio')} className="input resize-none" rows={3} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
