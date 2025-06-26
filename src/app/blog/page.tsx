import Link from 'next/link';
import { getSanityClient } from '../../lib/sanity.client';
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

async function getPosts(): Promise<Post[]> {
  try {
    const client = getSanityClient();
    const query = groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      summary,
      "categories": categories[]->{title}
    }`;
    return await client.fetch<Post[]>(query);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <h1 className="text-6xl font-bold mb-20 text-white tracking-tight">
          Blog<span className="text-purple-500">.</span>
        </h1>
        
        <div className="grid gap-8">
          {posts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post._id}>
              <article className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-purple-400 text-sm font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <time className="text-gray-500 font-mono">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex gap-2">
                            {post.categories.map((category, idx) => (
                              <span 
                                key={idx} 
                                className="text-purple-400 text-xs uppercase tracking-wider font-medium"
                              >
                                {category.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-gray-700 group-hover:border-purple-500 transition-colors duration-300">
                      <svg 
                        className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 17L17 7m0 0H7m10 0v10" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 