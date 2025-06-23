import { getSanityClient } from '../../../lib/sanity.client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '../../../lib/sanity.image';
import Image from 'next/image';

interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  body: {
    _type: string;
    children?: Array<{
      _type: string;
      text: string;
      marks?: string[];
    }>;
    [key: string]: unknown;
  }[];
  mainImage?: {
    _type: string;
    asset: {
      _ref: string;
    };
    [key: string]: unknown;
  };
  categories?: {
    title: string;
  }[];
}

export async function generateStaticParams() {
  const query = groq`*[_type == "post"]{ "slug": slug.current }`;
  const slugs = await getSanityClient().fetch<{slug: string}[]>(query);
  return slugs.map(({ slug }) => ({ slug }));
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const client = getSanityClient();
    const query = groq`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        publishedAt,
        body,
        mainImage,
        categories[]->{title}
      }
    `;
    
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPost(slug);
  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.width(1200).height(600).url() : null;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-5xl font-bold mb-4 text-white">{post.title}</h1>
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        {post.categories && post.categories.length > 0 && <span>&middot;</span>}
        <div className="flex space-x-2">
          {post.categories?.map((category, index) => (
            <span key={index} className="bg-gray-800 px-2 py-1 rounded-full text-xs">
              {category.title}
            </span>
          ))}
        </div>
      </div>
      {imageUrl && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <div className="prose prose-invert max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
};

export default BlogPostPage; 