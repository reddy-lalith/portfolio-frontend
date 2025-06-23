// app/page.tsx
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import GitHubActivity from '@/components/GitHubActivity';
import EmailLink from '@/components/EmailLink';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-gray-300 flex flex-col font-sans items-center relative">
      {/* GitHub Activity Feed - Aligned with navbar */}
      <div className="absolute top-0 left-4 sm:top-0 sm:left-12 w-80 z-20">
        <GitHubActivity />
      </div>

      {/* Main Content Area - Centered */}
      <section className="flex flex-grow flex-col items-center justify-center text-left px-4 w-full"> {/* Changed text-center to text-left for the section */}
        <div className="max-w-xl w-full"> {/* Adjust max-width as needed. Default is 640px for max-w-xl */}
          
          {/* Row 1: Name and Social Icons */}
          <div className="flex justify-between items-baseline mb-2 sm:mb-3">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
              Lalith Reddy
            </h1>
            <div className="flex space-x-3 sm:space-x-4 items-center">
              <a 
                  href="https://github.com/reddy-lalith"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="GitHub" 
                  className="text-gray-400 hover:text-white transition-colors"
              >
                  <FaGithub size={24} /> {/* Adjust size as needed */}
              </a>
              <a 
                  href="https://linkedin.com/in/lalithreddy" // Replace YOUR_PROFILE
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="LinkedIn" 
                  className="text-gray-400 hover:text-white transition-colors"
              >
                  <FaLinkedin size={24} />
              </a>
              <EmailLink />
            </div>
          </div>

          {/* Row 2: Currently Working On Section - Minimalistic with Glow */}
          <div className="mb-4 sm:mb-6 p-3 border border-purple-500/30 rounded shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <div className="text-sm text-gray-400 mb-2">Currently working on:</div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-purple-400">•</span>
                <div>
                  <span className="text-purple-400 font-medium">Leetpuzzle</span>
                  <span className="text-gray-300 text-sm ml-2">Think Wordle but for LeetCode</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400">•</span>
                <div>
                  <span className="text-purple-400 font-medium">Pit Patter</span>
                  <span className="text-gray-300 text-sm ml-2">Mobile app bridging the gap between students at UNC Chapel Hill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Horizontal Line */}
          <hr className="border-t border-gray-600 mb-2 sm:mb-3" />

          {/* Row 4: Details below line */}
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 px-1"> {/* px-1 for slight inset if needed */}
            <span>@UNC Chapel Hill</span>
            <span>Full-Stack Engineer</span>
          </div>

        </div>
      </section>

      {/* Optional Footer or empty space */}
      <footer className="w-full p-4 text-center text-xs text-gray-600">
        {/* Example: Copyright Lalith Reddy © {new Date().getFullYear()} */}
      </footer>
    </main>
  );
}