import { NextResponse } from 'next/server'
import Category from '../../../../../../models/category'
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/update-title/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {categoryId, optionIdx, optionId, subOptionId, subOptionIdx, value} = reqData
    //console.log(reqData)
    dbConnect();
    
    let filterObj:any = {
        "_id":categoryId
    }
    
    if(optionId !== ''){
        filterObj["options._id"] = optionId
        if(subOptionId !== ''){
            filterObj[`options.${optionIdx}.options._id`] = subOptionId
        }
    }

    let setObj:any = {}

    if(optionId === '' && subOptionId === ''){
        setObj.category = value
    }else{
        if(optionId !== ''){
            if(subOptionId === ''){
                setObj['options.$.category'] = value
            }else {
                setObj[`options.${optionIdx}.options.${subOptionIdx}.category`] = value
            }
        }
    }
    console.log(filterObj)
    console.log(setObj)
    try{        
        const editResult = await Category.updateOne(
            filterObj, 
            {
                $set:setObj
            }
        )
        return NextResponse.json({ message: 'Category edited!', editResult });
        //return NextResponse.json({ message: '/api/admin/manage-categories/update-title/ POST' });
    }catch(err:any){
        return NextResponse.json({ message: 'Error update category / option / sub option title!', error:err });
    }        
}