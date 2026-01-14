import { useEffect, useState } from 'react'
import { useAppSelector } from '../hooks/store-hooks'
import { supabase } from '../supabaseClient'
import { toast } from 'sonner'
import type { Profile as ProfileType } from '../types/profile'
import InputLabelGroup from '../components/input-label-goup'
import StyledInput from '../components/styled-input'
import FormSubmitButton from '../components/styled-submit-btn'

const Profile = () => {
  const user = useAppSelector((state) => state.user.value)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        toast.error('Failed to load profile')
        setIsLoading(false)
        return
      }

      setProfile(data)
      setDisplayName(data.display_name || '')
      setAvatarPreview(data.avatar)
      setIsLoading(false)
    }

    fetchProfile()
  }, [user?.id])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar size must be less than 5MB')
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user?.id) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `private/${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      toast.error(`Avatar upload failed: ${uploadError.message}`)
      return null
    }

    const { data, error: urlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    if (urlError || !data) {
      toast.error(`Failed to generate avatar URL: ${urlError?.message}`)
      return null
    }

    return data.signedUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    if (!displayName.trim()) {
      toast.error('Display name is required')
      return
    }

    setIsSubmitting(true)

    let avatarUrl = profile?.avatar

    if (avatarFile) {
      avatarUrl = await uploadAvatar(avatarFile)
      if (!avatarUrl) {
        setIsSubmitting(false)
        return
      }
    }

    const updateData: { display_name: string; avatar?: string | null } = {
      display_name: displayName
    }

    if (avatarFile && avatarUrl) {
      updateData.avatar = avatarUrl
    }

    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', user.id)
      .select()

    setIsSubmitting(false)

    if (error) {
      toast.error('Failed to update profile. Check RLS policies.')
      console.error('Update error:', error)
      return
    }

    if (!data || data.length === 0) {
      toast.error('Update blocked. Please check database permissions.')
      return
    }

    toast.success('Profile updated successfully!')

    const updatedProfile = data[0]
    setProfile(updatedProfile)
    setAvatarFile(null)
    setAvatarPreview(updatedProfile.avatar)
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 mb-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-sky-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-sky-500 flex items-center justify-center text-white text-4xl font-semibold border-4 border-sky-600">
                {displayName.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <InputLabelGroup>
            <label htmlFor="display_name" className="text-sm font-medium text-slate-700">
              Display Name
            </label>
            <StyledInput
              id="display_name"
              placeholder="Your display name"
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
            />
          </InputLabelGroup>

          <InputLabelGroup>
            <label htmlFor="avatar" className="text-sm font-medium text-slate-700">
              Change Avatar
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-black"
            />
            {avatarFile && (
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null)
                  setAvatarPreview(profile?.avatar || null)
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove selected image
              </button>
            )}
          </InputLabelGroup>

          <FormSubmitButton disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </FormSubmitButton>
        </form>
      </div>
    </div>
  )
}

export default Profile