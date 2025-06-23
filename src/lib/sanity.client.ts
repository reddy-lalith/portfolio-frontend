import {createClient, type SanityClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const apiVersion = process.env.SANITY_API_VERSION || '2025-06-04' // Fallback

// Only create client if environment variables are present
let client: SanityClient | null = null;

if (projectId && dataset) {
  client = createClient({
    projectId,
    dataset,
    apiVersion, // https://www.sanity.io/docs/api-versioning
    useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster responses
    // perspective: 'published', // Default is 'published', 'raw' for drafts, 'previewDrafts' for previews
  });
}

// Safe client function that handles null case
export const getSanityClient = () => {
  if (!client) {
    throw new Error('Sanity client not configured. Please set SANITY_PROJECT_ID and SANITY_DATASET environment variables.');
  }
  return client;
};

export { client };