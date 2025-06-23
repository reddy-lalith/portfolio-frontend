import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const username = process.env.GITHUB_USERNAME || 'reddy-lalith';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // Fetch user's public events
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=10`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-app'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();

    // Filter and format events
    const filteredEvents = events
      .filter((event: any) => 
        ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent'].includes(event.type)
      )
      .slice(0, 5)
      .map((event: any) => ({
        id: event.id,
        type: event.type,
        repo: {
          name: event.repo.name
        },
        created_at: event.created_at,
        payload: event.payload
      }));

    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity' },
      { status: 500 }
    );
  }
} 