import { NextResponse } from 'next/server'
/*
PROTECT THIS ROUTE!!
*/
export async function GET(req:Request) {    
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