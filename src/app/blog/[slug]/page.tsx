import { client } from '../../../lib/sanity.client';
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
    asset: {
      _ref: string;
    };
  };
  categories?: {
    title: string;
  }[];
}

export async function generateStaticParams() {
  const query = groq`*[_type == "post"]{ "slug": slug.current }`;
  const slugs = await client.fetch<{slug: string}[]>(query);
  return slugs.map(({ slug }) => ({ slug }));
}

async function getPost(slug: string) {
  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    body,
    mainImage,
    "categories": categories[]->{title}
  }`;
  return client.fetch<Post>(query, { slug });
}

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  const post = await getPost(params.slug);
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