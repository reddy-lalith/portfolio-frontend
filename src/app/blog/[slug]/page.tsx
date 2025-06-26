import { getSanityClient } from '../../../lib/sanity.client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '../../../lib/sanity.image';
import Image from 'next/image';
import Link from 'next/link';

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
    <article className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors duration-300 mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-mono">back to blog</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm">
            <time className="text-gray-500 font-mono">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {post.categories && post.categories.length > 0 && (
              <>
                <div className="h-4 w-px bg-gray-800" />
                <div className="flex gap-3">
                  {post.categories.map((category, index) => (
                    <span key={index} className="text-purple-400 uppercase tracking-wider font-medium">
                      {category.title}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {imageUrl && (
          <div className="mb-12 overflow-hidden rounded-xl border border-gray-800">
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300 prose-strong:text-white prose-code:text-purple-400 prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-400 prose-blockquote:italic">
          <PortableText value={post.body} />
        </div>
        
        <div className="mt-20 pt-12 border-t border-gray-800">
          <Link href="/blog" className="inline-flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage; 