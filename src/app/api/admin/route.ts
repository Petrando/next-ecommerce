import { NextResponse } from 'next/server'

export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/admin GET' });
}

export async function POST(req:Request) {

    return NextResponse.json({ message: '/api/admin POST' });
}