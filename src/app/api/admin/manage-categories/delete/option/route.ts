import { NextResponse } from 'next/server'
import Category from '../../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/delete/option/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {categoryId, optionId} = reqData
    dbConnect();
    try{
        const deleteOptionResult = await Category.findOneAndUpdate(
            {_id:categoryId}, 
            {
                $pull:{options:{_id:optionId}}
            }
        )
        return NextResponse.json({ message: 'Option deleted!', result:deleteOptionResult });
    }catch(err:any){
        return NextResponse.json({ message: 'Error deleting option!', error:err });
    }        
}