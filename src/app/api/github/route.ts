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

    console.log('GitHub API called for username:', username); // Debug log
    console.log('GitHub token exists:', !!token); // Debug log (don't log the actual token)

    if (!token) {
      console.log('No GitHub token found'); // Debug log
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // Fetch user's events (including private ones if token has access)
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-app',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        cache: 'no-store', // Don't cache - always fetch fresh data
        next: { revalidate: 0 } // Next.js specific - no caching
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();
    console.log('Raw GitHub events count:', events.length); // Debug log
    console.log('Raw GitHub events:', events.slice(0, 5)); // Debug log - show first 5 events
    console.log('Most recent event date:', events[0]?.created_at); // Debug log

    // Filter and format events - include more event types
    const filteredEvents = events
      .filter((event: GitHubEvent) => 
        ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent', 
         'WatchEvent', 'DeleteEvent', 'PublicEvent', 'MemberEvent', 'CommitCommentEvent',
         'PullRequestReviewEvent', 'PullRequestReviewCommentEvent', 'IssueCommentEvent',
         'ReleaseEvent'].includes(event.type)
      )
      .slice(0, 10) // Get more events
      .map((event: GitHubEvent) => ({
        id: event.id,
        type: event.type,
        repo: {
          name: event.repo.name
        },
        created_at: event.created_at,
        payload: event.payload
      }));

    console.log('Filtered events count:', filteredEvents.length); // Debug log
    console.log('Filtered events:', filteredEvents); // Debug log
    
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