import { NextResponse } from 'next/server'
import Category from '../../../../../../models/category'
import { IOption, ISubOption } from '../../../../../../types';
import dbConnect from '@/utils/dbConnect'

export async function GET(req:Request) {
    return NextResponse.json({ message: '/api/admin/manage-categories/update-title/ GET' });
}

export async function POST(req:Request) {
    
    const reqData = await req.json()
    const {categoryId, optionIdx, optionId, subOptionId, subOptionIdx, productCount} = reqData
    console.log('delete category route....')
    console.log(reqData)
    
    
    if(typeof productCount === 'undefined'){
        return NextResponse.json({ message: 'product count not found, aborting delete!' });
    }
    if(productCount > 0){
        return NextResponse.json({ message: `category have ${productCount} product(s), aborting delete!` });
    }
    dbConnect();
    try{    
        
                  
         
        if(optionId !== '0'){
            
            let category = await Category.findById(categoryId)
            console.log('category : ')
            console.log(category)
            if('options' in category && Array.isArray(category.options)){
                let updatedOptions = []
                if(subOptionId === '0'){ 
                    console.log('deleting option...')
                    if(category.options.length > 1){//category must have at least 1 option
                        updatedOptions = category.options.filter((d:IOption) => d._id !== optionId)                    
                    }                                   
                }else{
                    console.log('deleting sub option')
                    updatedOptions = JSON.parse(JSON.stringify(category.options))                    
                    updatedOptions[optionIdx].options = updatedOptions[optionIdx].options.filter((d:ISubOption) => d._id !== subOptionId)                                        
                }
                category.options = updatedOptions
            }
            console.log('category : ')
            console.log(category)
            const updatedCategory = await category.save()
            return NextResponse.json({ message: 'Category option/sub-option deleted!', updatedCategory });
        }else{
            const deletedCategory = Category.deleteOne({_id:categoryId})
            return NextResponse.json({ message: 'Category  deleted!', deletedCategory });
        }
        
        
    }catch(err:any){
        return NextResponse.json({ message: 'Error update category / option / sub option title!', error:err });
    }        
}