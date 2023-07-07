import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req:NextRequest){
    const { url } = req;
        
    const isUserApi = url.includes('user')
    const isAdminApi = url.includes('admin')
    if(isUserApi || isAdminApi){
        const token = await getToken({
            req,
            secret:process.env.SECRET
        })
        const role = token?.user.role
        if(isUserApi){
            if(!role){
                return NextResponse.json({message:'you are not logged in.'})
            }
        }
        if(isAdminApi){
            if(!role || role !== 'admin'){
                return NextResponse.json({message:'you are not authorized as admin.'})
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/users/:path*', '/api/admin/:path*', '/api/protected/user', '/api/protected/admin']
};