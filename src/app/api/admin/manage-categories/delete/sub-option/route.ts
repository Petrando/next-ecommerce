import { NextResponse } from 'next/server'
import Category from '../../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/delete/sub-option/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {categoryId, optionId, subOptionId} = reqData
    dbConnect();
    try{
        const deleteSubOptionResult = await Category.updateOne(
            {
                "_id":categoryId, 
                "options._id": optionId
            }, 
            {
                $pull:{
                    "options.$.options": {_id:subOptionId}
                }
            }
        )
        return NextResponse.json({ message: 'Sub option deleted!', result:deleteSubOptionResult });
    }catch(err:any){
        return NextResponse.json({ message: 'Error deleting sub option!', error:err });
    }        
}