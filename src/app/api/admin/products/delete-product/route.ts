import { NextResponse } from 'next/server'
import Product from '../../../../../../models/product';
import Order from '../../../../../../models/order';
import dbConnect from '@/utils/dbConnect'


export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/products/delete-product GET' });
}

export async function POST(req:Request) {
    const reqQuery = await req.json()
    console.log('delete reqQuery : ', reqQuery)
    const {_id} = reqQuery

    try{
        const productOrders = await Order.find({products: {$elemMatch: {_id}}})
        if(productOrders.length > 0){
            //item is in order list, deactivate
            const deactivatedItem = await Product.findOneAndUpdate({_id}, {$set:{isActive:false}})
            return NextResponse.json({ 
                message: `Item has been ordered ${productOrders.length} times. Item deactivated`,
                    deactivatedItem
            });
        }else{
            //item has not been ordered yet, deactivate
            const deletedItem = await Product.findOneAndDelete({_id})
            return NextResponse.json({ message: `Item deleted`, deletedItem });
        }                    
    }catch(err){
        return NextResponse.json({ message: '/api/admin/products/delete-product POST error', err });
    }
    
    
    
}