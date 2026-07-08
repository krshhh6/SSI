import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for tracking IP requests.
// Note: On Vercel this is isolated per-edge-server, but on a VPS (Node.js) it is perfectly global per process.
const rateLimitMap = new Map<string, { count: number; startTime: number }>();

export function middleware(request: NextRequest) {
  // Extract the user's IP address. Fallback to 'unknown' if not found.
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate Limiting Rules
  const MAX_REQUESTS = 100; // Max requests allowed per window
  const TIME_WINDOW_MS = 60 * 1000; // 1 minute
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 1,
      startTime: Date.now(),
    });
  } else {
    const data = rateLimitMap.get(ip)!;
    const now = Date.now();
    
    // If the time window has passed, reset the counter
    if (now - data.startTime > TIME_WINDOW_MS) {
      data.count = 1;
      data.startTime = now;
    } else {
      // Otherwise, increment the counter
      data.count++;
      
      // If the limit is reached, reject the request with a 429 status code
      if (data.count > MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too Many Requests', 
            message: 'You have been rate limited to protect the server from spam. Please wait a minute and try again.' 
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': '60' // Tells the browser/bots to wait 60 seconds
            } 
          }
        );
      }
    }
  }

  // If under the limit, allow the request to proceed normally
  return NextResponse.next();
}

// Configure which paths this rate limiter should run on.
// We apply this to API routes where database writes/spam can happen.
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
