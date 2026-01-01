'use server'

import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export async function uploadReceipt(data: FormData) {
  const file = data.get('file') as File
  
  if (!file) {
    throw new Error('No file provided')
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    })

    // revalidatePath('/payments')
    return blob.url
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Error uploading file')
  }
}

