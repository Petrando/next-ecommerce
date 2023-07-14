import { NextResponse } from 'next/server';
import Product from '../../../../../../models/product';
import dbConnect from '@/utils/dbConnect';
import { categorySearchAggregation, createProductAggregation } from '@/utils/helpers/mongo-query-functions';

export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/products/count-products/by-category/ GET' });
}

export async function POST(req:Request) {
    const reqQuery = await req.json()
    const categoryAggregation = categorySearchAggregation(reqQuery)    
    const productAggregation = createProductAggregation(categoryAggregation) 
    
    dbConnect()
	try{
		const productCount = await Product.aggregate([...productAggregation, {$count: "totalCount"}])
		return NextResponse.json({ message: 'Products per category counted!', productCount});
	}
	catch(err){
		return NextResponse.json({ message: 'Error counting products per category!', error:err });
	}
    
    //getProductsPerPage(skip, limit, [], sortBy);
    
}