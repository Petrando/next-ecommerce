import { NextResponse } from 'next/server'
import Category from '../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/add-option/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {_id, newOption} = reqData
    dbConnect();
    try{
        const addOptionResult = await Category.findOneAndUpdate(
            {_id}, 
            {
                $push:{options:newOption}
            }
        )
        return NextResponse.json({ message: 'New option added!', category:addOptionResult });
    }catch(err:any){
        return NextResponse.json({ message: 'Error adding option!', error:err });
    }        
}