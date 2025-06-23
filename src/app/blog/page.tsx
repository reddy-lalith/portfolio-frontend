import Link from 'next/link';
import { client } from '../../lib/sanity.client';
import { groq } from 'next-sanity';

interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  summary: string;
  categories?: {
    title: string;
  }[];
}

async function getPosts() {
  const query = groq`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    "categories": categories[]->{title}
  }`;
  return client.fetch<Post[]>(query);
}

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-5xl font-bold mb-12 text-center text-white">Blog</h1>
      <div className="space-y-10">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post._id} legacyBehavior>
            <a className="block group">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-3xl font-semibold text-gray-100 group-hover:text-white transition-colors">
                  {post.title}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
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
                <p className="text-gray-300 mt-4">{post.summary}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage; 