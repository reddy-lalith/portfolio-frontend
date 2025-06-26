import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full p-6 sm:p-8 sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-lg hover:text-purple-400 transition-colors">
          LR<span className="text-purple-500">.</span>
        </Link>
        <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
          <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
          <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          <li>
            <Link href="/resume.pdf" // Assuming resume.pdf is in your /public folder
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors">
              Resume
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 