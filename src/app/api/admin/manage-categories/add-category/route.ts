import { NextResponse } from 'next/server'
import Category, { iCategory } from '../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'
import { ICategoryData } from '@/components/admin/manage-category/AddCategory';

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/add-category/ GET' });
}

export async function POST(req:Request) {
    const reqData = await req.json()
    dbConnect();
    try{
        const newCategory = await Category.create(reqData)
        return NextResponse.json({ message: 'Created category!', category:newCategory });
    }catch(err:any){
        return NextResponse.json({ message: 'Error creating category!', error:err });
    }      
}