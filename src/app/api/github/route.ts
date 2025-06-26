import { NextResponse } from 'next/server';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || 'reddy-lalith';
    const token = process.env.GITHUB_TOKEN;

    console.log('GitHub API called for username:', username);

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // First, get recently updated repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=20`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();
    const recentRepos = repos.slice(0, 5); // Get 5 most recently updated repos

    // Now get recent commits from these repos
    const allActivities: GitHubEvent[] = [];

    for (const repo of recentRepos) {
      try {
        // Get recent commits
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=5`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
            cache: 'no-store',
          }
        );

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          
          // Convert commits to event format
          commits.forEach((commit: any) => {
            if (commit.author?.login === username) {
              allActivities.push({
                id: commit.sha,
                type: 'PushEvent',
                repo: {
                  name: repo.full_name
                },
                created_at: commit.commit.author.date,
                payload: {
                  commits: [{
                    message: commit.commit.message,
                    sha: commit.sha
                  }]
                }
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error fetching commits for ${repo.full_name}:`, err);
      }
    }

    // Also fetch public events as additional data
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=30`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      allActivities.push(...events);
    }

    // Remove duplicates and sort by date
    const uniqueActivities = Array.from(
      new Map(allActivities.map(event => [`${event.type}-${event.created_at}-${event.repo.name}`, event])).values()
    );

    uniqueActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log('Total activities found:', uniqueActivities.length);
    console.log('Most recent activity:', uniqueActivities[0]);

    // Filter and format events
    const filteredEvents = uniqueActivities
      .filter((event: GitHubEvent) => 
        ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent', 
         'WatchEvent', 'DeleteEvent', 'PublicEvent', 'MemberEvent', 'CommitCommentEvent',
         'PullRequestReviewEvent', 'PullRequestReviewCommentEvent', 'IssueCommentEvent',
         'ReleaseEvent'].includes(event.type)
      )
      .slice(0, 10)
      .map((event: GitHubEvent) => ({
        id: event.id,
        type: event.type,
        repo: {
          name: event.repo.name
        },
        created_at: event.created_at,
        payload: event.payload
      }));

    console.log('Filtered events count:', filteredEvents.length);
    console.log('First 3 events:', filteredEvents.slice(0, 3).map(e => ({
      type: e.type,
      repo: e.repo.name,
      date: e.created_at,
      timeAgo: getTimeAgo(e.created_at)
    })));
    
    // Return with no-cache headers
    return NextResponse.json(filteredEvents, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
} 