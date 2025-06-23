// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

const builder = imageUrlBuilder(client);

export function urlForImage(source: {
  _type: string;
  asset: {
    _ref: string;
  };
  [key: string]: unknown;
}) {
  if (!source || !source.asset) {
    return undefined;
  }
  return builder.image(source);
}