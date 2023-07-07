import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blockIfNotAdmin } from "@/utils/checkUser";

export async function POST(req:Request) {
    //blockIfNotAdmin()
        
    return NextResponse.json({ message: 'POST user handler : you are an authorized admin'})    
    
}

export async function GET(req:Request) {
    //blockIfNotAdmin()
        
    return NextResponse.json({ message: 'GET user handler : you are an authorized admin'});        
}