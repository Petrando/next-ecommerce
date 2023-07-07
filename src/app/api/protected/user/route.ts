import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blockIfNotLogged } from "@/utils/checkUser";

export async function POST(req:Request) {
    //blockIfNotLogged()
        
    return NextResponse.json({ message: 'POST user handler : you are logged in'})    
    
}

export async function GET(req:Request) {
    //blockIfNotLogged()

    return NextResponse.json({ message: 'GET user handler : you are logged in'});        
}