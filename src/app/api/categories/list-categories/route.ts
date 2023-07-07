import { NextResponse } from 'next/server'
import Category, { iCategory } from '../../../../../models/category'
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
/*

export async function GET(req:Request) {

    dbConnect();

    try{
        Category.find((err:any, data:iCategory[]) => {
            if(err){
                return NextResponse.json({ message: 'Error listing categories!', error:err });
            }
            return NextResponse.json({ message: 'Category list found!', data });
        })

        
    }
    catch(err){
        return NextResponse.json({ message: 'Error adding sub option!', error:err });
    }
}
*/