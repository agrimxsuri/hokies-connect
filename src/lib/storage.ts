import { supabase } from './supabase'

const BUCKET_NAME = 'avatars'

// Upload avatar image
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  // Get public URL
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Delete avatar
export const deleteAvatar = async (userId: string, fileName: string) => {
  const filePath = `avatars/${fileName}`
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (error) throw error
}

// Get avatar URL
export const getAvatarUrl = (userId: string, fileName: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`avatars/${fileName}`)

  return data.publicUrl
}
