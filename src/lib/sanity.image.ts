// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url'
// Ensure this path correctly points to your Sanity client configuration
import { client } from './sanity.client' 

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) { // <-- This makes the function available for import
  if (!source || !source.asset) {
    return undefined; 
  }
  return builder.image(source)
}