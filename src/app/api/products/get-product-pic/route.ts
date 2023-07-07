import { NextResponse } from 'next/server';
const cloudinary = require('cloudinary').v2;
// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req:Request) {
    const {public_id } = await req.json()    
    const url = await cloudinary.url(public_id/*, {
        width: 100,
        height: 150,
        Crop: 'fill'
    }*/);
    return NextResponse.json({ url });
}