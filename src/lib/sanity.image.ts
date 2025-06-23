// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url';
import { getSanityClient } from './sanity.client';

export function urlForImage(source: {
  _type: string;
  asset: {
    _ref: string;
  };
  [key: string]: unknown;
}) {
  try {
    const client = getSanityClient();
    const builder = imageUrlBuilder(client);
    
    if (!source || !source.asset) {
      return undefined;
    }
    return builder.image(source);
  } catch (error) {
    console.warn('Sanity image builder not available:', error);
    return undefined;
  }
}