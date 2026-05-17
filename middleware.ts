export { default } from 'next-auth/middleware';
export const config = { matcher: ['/dashboard/:path*','/goals/:path*','/manager/:path*','/admin/:path*','/checkins/:path*','/reports/:path*'] };
