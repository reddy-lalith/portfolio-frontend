// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';

const ProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-5xl font-bold mb-4 text-white">Project</h1>
      <div className="text-center text-gray-400">
        <p>Project "{slug}" coming soon!</p>
        <p className="mt-2 text-sm">Check back later for updates.</p>
      </div>
    </div>
  );
};

export default ProjectPage;