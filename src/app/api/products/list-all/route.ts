import { NextResponse } from 'next/server';
import Product from '../../../../../models/product';
import { productsPerPageAggregation } from '../list-search/route';
import dbConnect from '@/utils/dbConnect';

export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/products/list-all/ GET' });
}

export async function POST(req:Request) {
    const reqQuery = await req.json()
    const {skip, limit, sortBy } = reqQuery
    const aggregateStages = productsPerPageAggregation(skip, limit, [], sortBy)
    
    dbConnect()
	try{
		const products = await Product.aggregate(aggregateStages)
		return NextResponse.json({ message: 'Products found!',  products});
	}
	catch(err){
		return NextResponse.json({ message: 'Error getting products!', error:err });
	}
    
    //getProductsPerPage(skip, limit, [], sortBy);
    
}