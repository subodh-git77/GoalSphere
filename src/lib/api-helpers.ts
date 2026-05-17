import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';
export async function requireRole(roles:string[]){ const session=await getServerSession(authOptions); if(!session?.user) return {error:NextResponse.json({error:'Unauthorized'},{status:401})}; if(!roles.includes((session.user as any).role)) return {error:NextResponse.json({error:'Forbidden'},{status:403})}; return {session}; }
export function ok(data:any,status=200){ return NextResponse.json(data,{status}); }
