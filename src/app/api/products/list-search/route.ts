import { NextResponse } from 'next/server';
import { categorySearchAggregation, productsPerPageAggregation } from '@/utils/helpers/mongo-query-functions';
import Product from '../../../../../models/product';
import dbConnect from '@/utils/dbConnect';

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/products/list-search/ GET' });
}

export async function POST(req:Request) {
    const {search, categoryId, optionId, subOptionId, skip, limit } = await req.json()
	console.log(search, categoryId, optionId, subOptionId, skip, limit)

    let searchAggregation = [];	
	if(search!==""){
		const itemNameMatch = { $match: { $expr: { $regexFind: { input: "$itemName", regex: search, options:"i" }  } } }
		//const itemNameMatch = { itemName: { $regex: /pattern/, $options: '<options>' } }
		searchAggregation.push(itemNameMatch);
	}

	const completeAggregation = searchAggregation.concat(categorySearchAggregation({ categoryId, optionId, subOptionId }));

    const aggregateStages = productsPerPageAggregation( skip, limit, completeAggregation);

	dbConnect()
	try{
		const products = await Product.aggregate(aggregateStages)
		return NextResponse.json({ message: 'Products found!',  products});
	}
	catch(err){
		return NextResponse.json({ message: 'Error getting products!', error:err });
	}
	//return NextResponse.json({ message: '/api/products/list-search/ POST' });
}

