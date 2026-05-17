import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export const authOptions: NextAuthOptions = {
  session:{strategy:'jwt'}, pages:{signIn:'/login'},
  providers:[CredentialsProvider({name:'credentials',credentials:{email:{},password:{}}, async authorize(credentials){
    if(!credentials?.email || !credentials?.password) return null;
    const user=await prisma.user.findUnique({where:{email:credentials.email}});
    if(!user || !user.isActive) return null;
    const ok=await bcrypt.compare(credentials.password,user.password); if(!ok) return null;
    return {id:user.id,email:user.email,name:user.name,role:user.role,department:user.department} as any;
  }})],
  callbacks:{ async jwt({token,user}){ if(user){ token.role=(user as any).role; token.department=(user as any).department; token.id=(user as any).id;} return token; }, async session({session,token}){ (session.user as any).id=token.id; (session.user as any).role=token.role; (session.user as any).department=token.department; return session; } }
};
