import { NextResponse } from 'next/server'
import Category from '../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    dbConnect();
    try{
        const categoryList = await Category.find()
        return NextResponse.json({ message: 'Category list found!', data:categoryList });
        
    }
    catch(err){
        return NextResponse.json({ message: 'Error listing categories!', error:err });
    }
}

export async function POST(req:Request) {

    return NextResponse.json({ message: '/api/admin/manage-categories/list-categories/ POST' });
}