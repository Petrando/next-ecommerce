import { NextResponse } from 'next/server';
import Product from '../../../../../models/product';
import { productsPerPageAggregation } from '../list-search/route';
import dbConnect from '@/utils/dbConnect';

export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/products/list-all/ GET' });
}

export async function POST(req:Request) {
    const reqQuery = await req.json()
    /*
        If countAll true, just count all the products.
        If countAll false, only count products with isActive field true
    */
    const { countAll } = reqQuery
    
    let findParam:{isActive?:boolean} = {}
    if(!countAll){
        findParam.isActive = true
    }
    dbConnect()
	try{
		const productCount = await Product.find(findParam).count()
		return NextResponse.json({ message: 'Products counted!',  productCount});
	}
	catch(err){
		return NextResponse.json({ message: 'Error counting products!', error:err });
	}
    
    //getProductsPerPage(skip, limit, [], sortBy);
    
}