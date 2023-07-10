import { NextResponse } from 'next/server'
import Product from '../../../../../../models/product'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/update-title/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    //console.log(reqData)
    const {_id, ...updatedParams} = reqData
    
    try{   
             
        const editResult = await Product.updateOne(
            {_id}, 
            {
                $set:{...updatedParams}
            }
        )
        return NextResponse.json({ message: 'Product edited!', editResult});
        
    }catch(err:any){
        return NextResponse.json({ message: 'Edit product err', error:err });
    }        
}