import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req:Request) {
    const session = await getServerSession(authOptions)
    console.log('session in POST route : ')
    console.log(session)
    if(session){
        return NextResponse.json({message:'POST user handler : you are authorized'})
    }
    else{
        return NextResponse.json({ message: 'POST user handler : you are NOT authorized'});
    }
    
}

export async function GET(req:Request) {
    const session = await getServerSession(authOptions)
    console.log('session in GET route : ')
    console.log(session)
    if(session){
        return NextResponse.json({message:'GET user handler : you are authorized'})
    }
    else{
        return NextResponse.json({ message: 'GET user handler : you are NOT authorized'});
    }
    
}