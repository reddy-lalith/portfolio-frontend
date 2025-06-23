// app/projects/[slug]/page.tsx
import { client } from '@/lib/sanity.client';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity.image'; // Your helper

// Define types for your project data (you can expand this)
interface ProjectData {
  _id: string;
  title?: string;
  slug: {
    current: string;
  };
  mainImage?: {
    _type: string;
    asset: {
      _ref: string;
    };
    alt?: string;
    [key: string]: unknown;
  };
  body?: {
    _type: string;
    children?: Array<{
      _type: string;
      text: string;
      marks?: string[];
    }>;
    [key: string]: unknown;
  }[];
  publishedDate?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  technologies?: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<ProjectData | null> {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    mainImage,
    body,
    publishedDate,
    projectUrl,
    repositoryUrl,
    technologies
  }`;
  
  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // --- VITAL: Definition of mainImageUrl ---
  // First, get the image builder instance (or null if no mainImage)
  const imageBuilderInstance = project.mainImage ? urlForImage(project.mainImage) : null;
  
  // Then, build the URL (or null if no imageBuilderInstance)
  const mainImageUrl = imageBuilderInstance 
    ? imageBuilderInstance.width(1200).height(800).fit('crop').url() 
    : null;
  // --- End of VITAL section ---

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title || 'Untitled Project'}</h1>
      
      {project.publishedDate && (
        <p className="text-gray-600 mb-2">
          Published on: {new Date(project.publishedDate).toLocaleDateString()}
        </p>
      )}

      {/* Conditionally render the Image component */}
      {/* Ensure project.mainImage itself is checked for the alt tag */}
      {mainImageUrl && project.mainImage && (
        <div className="mb-6 relative w-full h-64 md:h-96">
          <Image
            src={mainImageUrl} 
            alt={project.mainImage.alt || project.title || 'Project image'}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}
      
      {project.technologies && project.technologies.length > 0 && (
        <div className="mb-4">
          <strong>Technologies:</strong> {project.technologies.join(', ')}
        </div>
      )}

      {project.body && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={project.body} />
        </div>
      )}

      <div className="mt-8 space-x-4">
        {project.projectUrl && (
          <a 
            href={project.projectUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Live Project
          </a>
        )}
        {project.repositoryUrl && (
          <a 
            href={project.repositoryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Code Repository
          </a>
        )}
      </div>
    </article>
  );
}