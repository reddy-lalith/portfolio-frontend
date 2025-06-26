'use client';

import { useEffect, useState } from 'react';
import { FaCode, FaCodeBranch, FaGitAlt, FaExclamationCircle, FaGithub } from 'react-icons/fa';

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload: {
    ref_type?: string;
    action?: string;
    [key: string]: unknown;
  };
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'PushEvent':
      return <FaCode className="text-blue-400" />;
    case 'CreateEvent':
      return <FaCodeBranch className="text-green-400" />;
    case 'PullRequestEvent':
      return <FaGitAlt className="text-purple-400" />;
    case 'IssuesEvent':
      return <FaExclamationCircle className="text-yellow-400" />;
    case 'ForkEvent':
      return <FaCodeBranch className="text-orange-400" />;
    default:
      return <FaCode className="text-gray-400" />;
  }
};

const getTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function GitHubActivity() {
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState([false, false, false, false, false]);
  const [feed, setFeed] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch GitHub activity
  const fetchGitHubActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/github', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub activity');
      }
      
      const data = await response.json();
      console.log('GitHub API Response:', data); // Debug log
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setFeed(data);
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity');
      // Fallback to dummy data if API fails
      setFeed([
        {
          id: '1',
          type: 'PushEvent',
          repo: { name: 'portfolio-frontend' },
          created_at: new Date().toISOString(),
          payload: {}
        },
        {
          id: '2',
          type: 'CreateEvent',
          repo: { name: 'portfolio-frontend' },
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          payload: { ref_type: 'branch' }
        },
        {
          id: '3',
          type: 'PullRequestEvent',
          repo: { name: 'portfolio-frontend' },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          payload: {}
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchGitHubActivity();
  }, []);

  // Animate badge, then cards in sequence
  useEffect(() => {
    if (!loading && feed.length > 0) {
      setBadgeVisible(true);
      const timeouts: NodeJS.Timeout[] = [];
      
      // Animate in each card after badge
      feed.slice(0, 5).forEach((_, i) => {
        timeouts.push(setTimeout(() => {
          setCardVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 700 + i * 200));
      });
      
      return () => timeouts.forEach(clearTimeout);
    }
  }, [loading, feed]);

  // Refresh data every 30 seconds (for testing)
  useEffect(() => {
    const interval = setInterval(fetchGitHubActivity, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && feed.length === 0) {
    return (
      <div className="space-y-2 relative w-64">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 shadow-xl rounded-full bg-black/80 px-4 py-2 border border-white/10 z-10">
          <span className="h-5 w-5 rounded-full bg-red-500 animate-pulse block" />
          <span className="rounded-full bg-gradient-to-tr from-purple-700 to-purple-400 p-1">
            <FaGithub className="text-white bg-transparent rounded-full text-3xl" />
          </span>
        </div>
        <div className="pt-6" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="p-2 bg-white/5 rounded-lg flex items-center gap-2" style={{ minHeight: '44px' }}>
            <div className="animate-pulse bg-gray-600 h-4 w-4 rounded" />
            <div className="flex-grow">
              <div className="animate-pulse bg-gray-600 h-3 w-24 rounded mb-1" />
              <div className="animate-pulse bg-gray-700 h-2 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 relative w-64">
      {/* Large, centered badge indicator above the feed with animation */}
      <div
        className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 shadow-xl rounded-full bg-black/80 px-4 py-2 border border-white/10 z-10 transition-all duration-500 ${badgeVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ pointerEvents: 'none' }}
      >
        <span className="h-5 w-5 rounded-full bg-red-500 animate-pulse block" />
        <span className="rounded-full bg-gradient-to-tr from-purple-700 to-purple-400 p-1">
          <FaGithub className="text-white bg-transparent rounded-full text-3xl" />
        </span>
      </div>
      <div className="pt-6" />
      {[0, 1, 2, 3, 4].map((i) => {
        const event = feed[i];
        return (
          <div
            key={event ? event.id : `placeholder-${i}`}
            className={`p-2 bg-white/5 rounded-lg flex items-center gap-2 transition-all duration-500 ${cardVisible[i] ? 'opacity-100 scale-100 hover:bg-white/10' : 'opacity-0 scale-75 pointer-events-none'}`}
            style={{ minHeight: '44px' }}
          >
            {cardVisible[i] && event ? (
              <>
                <div className="flex-shrink-0">{getEventIcon(event.type)}</div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs text-gray-300 truncate">{formatEvent(event)}</p>
                  <p className="text-[10px] text-gray-500">{getTimeAgo(event.created_at)}</p>
                </div>
              </>
            ) : null}
          </div>
        );
      })}
      {error && (
        <div className="text-xs text-red-400 mt-2 text-center">
          {error}
        </div>
      )}
    </div>
  );

  function formatEvent(event: GitHubEvent) {
    const repoName = event.repo.name.split('/')[1] || event.repo.name;
    switch (event.type) {
      case 'PushEvent':
        return `Pushed to ${repoName}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref_type} in ${repoName}`;
      case 'PullRequestEvent':
        return `Opened PR in ${repoName}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue in ${repoName}`;
      case 'ForkEvent':
        return `Forked ${repoName}`;
      default:
        return `${event.type} in ${repoName}`;
    }
  }
} 