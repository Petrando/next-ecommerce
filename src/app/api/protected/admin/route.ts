import { NextResponse } from "next/server";

export async function POST(req:Request) {
    return NextResponse.json({ message: 'POST user handler : you are an authorized admin'})    
    
}

export async function GET(req:Request) {
        
    return NextResponse.json({ message: 'GET user handler : you are an authorized admin'});        
}