import { NextResponse } from 'next/server';
import mongoose, { Schema, Mongoose } from 'mongoose';
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

interface IQuery {
    categoryId: string;
    optionId: string;
    subOptionId: string;
}

interface ICategoryMatcher{
    $match:{
        $expr:{
            $eq:[
                '$category.categoryId', Schema.Types.ObjectId
            ]
        }
    }
}

interface IOptionMatcher{
    $match:{
        $expr:{
            $eq:[
                '$category.option.optionId', Schema.Types.ObjectId
            ]
        }
    }
}

interface ISubOptionMatcher{
    $match:{
        $expr:{
            $eq:[
                '$category.option.subOption.subOptionId', Schema.Types.ObjectId
            ]
        }
    }
}

type matchers = '$category.categoryId' | '$category.option.optionId' | '$category.option.subOption.subOptionId';

interface ISearchAggregation {
    $match:{
        $expr:{
            $eq: (string | Schema.Types.ObjectId)[];
        };
    };
}

type ISearchAggregations = ISearchAggregation[]
export const categorySearchAggregation:any = (query:IQuery) => {

	//create search aggregation based on categoryId, optionId and subOptionId
	//sent from frontend
	//empty categoryId, optionId or subOptionId can be represented with "" or "0", 
	//depending on the requesting page
	

	const { categoryId, optionId, subOptionId } = query;	
	const searchAggregation = [];	
	
	/*
		if empty was sent as "0" then needs to convert to "", since somehow
		put test condition inside if (for example : if(categoryId === "" || categoryId === "0"))
		will result in error when creating ObjectId
	*/
	const categoryIdID = categoryId === "0"?"":categoryId;
	const optionID = optionId === "0"?"":optionId;
	const subOptionID = subOptionId === "0"?"":subOptionId;

	if(categoryIdID!==""){		
		const categoryMatch = {$match:{$expr:{$eq:["$category.categoryId", new mongoose.Types.ObjectId(categoryIdID)]}}}
		searchAggregation.push(categoryMatch)		
	}

	if(optionID!==""){		
		const optionMatch = {$match:{$expr:{$eq:["$category.option.optionId", /*ObjectId*/new mongoose.Types.ObjectId(optionID)]}}}
		searchAggregation.push(optionMatch)		
	}

	if(subOptionID!==""){		
		const subOptionMatch = {$match:{$expr:{$eq:["$category.option.subOption.subOptionId", /*ObjectId*/new mongoose.Types.ObjectId(subOptionID)]}}}
		searchAggregation.push(subOptionMatch)		
	}

	return searchAggregation;
}

export const createProductAggregation = (matchStages:any[]) => {
	let productAggregation = [		
		{
			$project : {
				itemName:1,itemDescription:1,isNewItem:1,
				"category":1,stock:1,sold:1, productPic:1, rating:1,review:1,price:1,createdAt:1
			}
		},		
		{
			$lookup: {
				from:"categories",
				let:{
					categoryId:"$category.categoryId",
					optionId:"$category.option.optionId",
					subOptionId:"$category.option.subOption.subOptionId"
				},
				pipeline: [
					{$match: {$expr: {$eq:["$$categoryId", "$_id"]}}},
					{$unwind:"$options"},
					{$match: {$expr: {$eq:["$$optionId", "$options._id"]}}},				
					{$facet:{"withSubOptions":[
								{$match:{$expr:{$gt:[{$size:"$options.options"}, 0]}}},
								{$unwind:"$options.options"},
								{$match: {$expr: {$eq:["$$subOptionId", "$options.options._id"]}}}], 
							 "withoutSubOptions":[{$match:{$expr:{$eq:[{$size:"$options.options"}, 0]}}}]}}
					/*
					{$match: {$expr: {$eq:["$$categoryId", "$_id"]}}},
					{$unwind:"$options"},
					{$facet:{
						'withOptionsSubOptions':[
							{$match: {$expr: {$eq:["$$optionId", "$options._id"]}}},
							{$match:{$expr:{$gt:[{$size:"$options.options"}, 0]}}},
							{$unwind:"$options.options"},
							{$match: {$expr: {$eq:["$$subOptionId", "$options.options._id"]}}}							
						],
						'withOptionsNoSubOptions':[
							{$match: {$expr: {$eq:["$$optionId", "$options._id"]}}},
							{$match:{$expr:{$eq:[{$size:"$options.options"}, 0]}}}
						],													
						'withoutOptions':[							
							{$match:{$expr:{$eq:[{$size:"$options.options"}, 0]}}},							
							//{$match: {$expr: {$eq:["$$optionId", null]}}}
						]
						
					}}	
					*/
				],
				as:"myCategory"
			}
		},
		{$unwind:"$myCategory"}
	]

	if(matchStages.length > 0){
		productAggregation.unshift(...matchStages);		
	}

	return productAggregation;
}

export function productsPerPageAggregation(skip = 0, limit = 8 , matchStages:any[] = [], sortBy = "itemName"){
	const productAggregation = createProductAggregation(matchStages);

	let sorting;
	switch(sortBy){
		case "itemName":
			sorting = {$sort:{itemName:1}}
		break;
		case "sold":
			sorting = {$sort:{sold:1, itemName:1}}
		break;
		case "createdAt":
			sorting = {$sort:{createdAt:-1, itemName:1}}
		break;
	}

	const productPerPageAggregation:any[] = [	
		{ $match : { isActive : true } },	
		...productAggregation,	
		sorting,	
		{$skip:skip},
		{$limit:limit}
	]

	//If want to return all item count also, then complete the below aggregation..
	/*
	if(skip === 0){//skip is zero only when first page, requesting also all item count for pagination 
				  //calculation
		Product.aggregate(productAggregation)
			.then(products => res.json(products))
    		.catch(err => res.status(400).json('Error: ' + err));		 

	}else {
		Product.aggregate(productPerPageAggregation)
			.then(products => res.json(products))
    		.catch(err => res.status(400).json('Error: ' + err));
	}*/
	return productPerPageAggregation
}