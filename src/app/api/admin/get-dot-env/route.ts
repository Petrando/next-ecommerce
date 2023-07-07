import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { blockIfNotAdmin } from '@/utils/checkUser';
/*
PROTECT THIS ROUTE!!
*/
export async function GET(req:Request) {    
    //blockIfNotAdmin()
    //const { url } = req
    //const { NEXTAUTH_URL } = process.env
    //console.log('url : ', req.url.substring(NEXTAUTH_URL?NEXTAUTH_URL.length:0))
    //console.log(process.env.NEXTAUTH_URL)
    const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env
    try{
        
        return NextResponse.json({ message: 'Reading dot env file!', 
            data:{cloudName:CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET} });
        
    }
    catch(err){
        return NextResponse.json({ message: 'Error reading dot env file!', error:err });
    }
}

export async function POST(req:Request) {

    return NextResponse.json({ message: '/api/admin/get-dot-env/ POST' });
}