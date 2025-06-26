import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || 'reddy-lalith';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 500 });
    }

    // Test different endpoints
    const tests = [];

    // Test 1: User info
    const userResponse = await fetch(`https://api.github.com/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    const userData = await userResponse.json();
    tests.push({
      endpoint: 'user',
      status: userResponse.status,
      login: userData.login,
      name: userData.name
    });

    // Test 2: Recent commits across all repos
    const reposResponse = await fetch(`https://api.github.com/user/repos?sort=pushed&per_page=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    const repos = await reposResponse.json();
    tests.push({
      endpoint: 'recent_repos',
      status: reposResponse.status,
      count: repos.length,
      most_recent: repos[0]?.name,
      last_push: repos[0]?.pushed_at
    });

    // Test 3: Events from different endpoints
    const eventEndpoints = [
      { name: 'user_events', url: `https://api.github.com/user/events?per_page=10` },
      { name: 'public_events', url: `https://api.github.com/users/${username}/events/public?per_page=10` },
      { name: 'received_events', url: `https://api.github.com/users/${username}/received_events?per_page=10` }
    ];

    for (const { name, url } of eventEndpoints) {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      const events = await response.json();
      
      // Check if events is actually an array
      if (Array.isArray(events)) {
        tests.push({
          endpoint: name,
          status: response.status,
          count: events.length,
          recent_events: events.slice(0, 3).map((e: any) => ({
            type: e.type,
            repo: e.repo?.name,
            created_at: e.created_at,
            time_ago: getTimeAgo(e.created_at)
          }))
        });
      } else {
        tests.push({
          endpoint: name,
          status: response.status,
          error: 'Not an array',
          data: events
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tests
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function getTimeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}