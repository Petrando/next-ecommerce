import { NextResponse } from 'next/server';
import Category from '../../../../../models/category';
import dbConnect from '@/utils/dbConnect';


export async function GET(req:Request) {

    return NextResponse.json({ message: '/api/categories/count-options/ GET' });
}

export async function POST(req:Request) {
    const reqQuery = await req.json()
    const { categoryId } = reqQuery 
    
    dbConnect()
	try{
		const category = await Category.findById(categoryId)
		return NextResponse.json({ message: 'Options counted!', optionCount:category.options.length});
	}
	catch(err){
		return NextResponse.json({ message: 'Error counting options in category!', error:err });
	}
    
    //getProductsPerPage(skip, limit, [], sortBy);
    
}