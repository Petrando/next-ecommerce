import { NextResponse } from 'next/server'
import Category from '../../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/delete/category/ GET' });
}

export async function POST(req:Request) {
    const reqData = await req.json()
    const { categoryId } = reqData
    dbConnect();
    try{
        const deletedCategory = await Category.findByIdAndRemove(categoryId)
        return NextResponse.json({ message: 'Category deleted!', result:deletedCategory });
    }catch(err:any){
        return NextResponse.json({ message: 'Error deleting category!', error:err });
    }      
}