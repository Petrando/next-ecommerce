import { getToken } from "next-auth/jwt"
import type { NextRequest, NextResponse } from "next/server"
import { NextResponse as res } from "next/server";
import { IncomingMessage } from 'http';

const secret = process.env.NEXTAUTH_SECRET

// CHECKING FUNCTIONS
export const hasToken = async (req:IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }) => {
    const token = await getToken({ req, secret })
    if(!token){
        return false
    }
    return true
}

export const isAdmin = async (req:NextRequest | IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }) => {
    const token = await getToken({ req, secret })
    if(!token || token.user.role !== 'admin'){
        return false
    }
    return true
}

// API MIDDLEWARE
export const hasTokenMiddleware = async (req:NextRequest, res:NextResponse, next:any) => {
    const token = await getToken({ req, secret })
    if(!token){
        return next(new Error('Not Allowed - Not logged in'))
    }
    next()
}
  
export const isAdminMiddleware = async (req:NextRequest, res:NextResponse, next:any) => {
    const token = await getToken({ req, secret })
    if(!token || token.user.role !== 'admin'){
        return next(new Error('Not Allowed - Not admin'))
    }
    next()
}