import { NextResponse } from 'next/server'

export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/admin/manage-categories/ GET' });
}

export async function POST(req:Request) {

    return NextResponse.json({ message: '/api/admin/manage-categories/ POST' });
}