// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  const subdomain = host.split('.')[0];

  if (subdomain && subdomain !== 'menu') {
    request.headers.set('x-empresa-slug', subdomain);
  }

  return NextResponse.next();
}