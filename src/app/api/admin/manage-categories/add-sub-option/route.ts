import { NextResponse } from 'next/server'
import Category from '../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/add-sub-option/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {_id, optionId, newSubOption} = reqData
    dbConnect();
    try{
        const addSubOptionResult = await Category.updateOne(
            {
                "_id":_id, 
                "options._id": optionId
            }, 
            {
                $push:{
                    "options.$.options": {category:newSubOption}
                }
            }
        )
        return NextResponse.json({ message: 'New sub option added!', category:addSubOptionResult });
    }catch(err:any){
        return NextResponse.json({ message: 'Error adding sub option!', error:err });
    }        
}