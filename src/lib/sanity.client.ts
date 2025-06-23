import {createClient, type SanityClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-06-04' // Fallback

if (!projectId || !dataset) {
  throw new Error(
    'Sanity projectId or dataset missing. Check your .env.local file.',
  )
}

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster responses
  // perspective: 'published', // Default is 'published', 'raw' for drafts, 'previewDrafts' for previews
})