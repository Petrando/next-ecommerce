import { NextResponse } from 'next/server'
import Product from '../../../../../../models/product';
import dbConnect from '@/utils/dbConnect'


export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/products/add-product GET' });
}

export async function POST(req:Request) {
    const reqData = await req.json()
    dbConnect();
    try{
        const newProduct = await Product.create(reqData)
        return NextResponse.json({ message: 'New Product saved!', newProduct });
    }catch(err:any){
        return NextResponse.json({ message: 'Error adding new product!', error:err });
    }      
}