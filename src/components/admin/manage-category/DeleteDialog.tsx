'use client'

import { useState, useEffect, FunctionComponent, MouseEventHandler } from 'react';
import { ButtonWithLoader } from '@/components/Buttons';
import { FullscreenBaseModal } from '@/components/Modal';

interface IDeleteDialog {
    title: string; 
    deleteParams:{
        categoryId:string,
        optionId:string,
        subOptionId:string
    };
    close: MouseEventHandler<HTMLButtonElement>;
}

export const DeleteDialog:FunctionComponent<IDeleteDialog> = ({title, deleteParams, close}) => {
    const [productCount, setProductCount] = useState<{
        counted:boolean, count:number, countError:any}>({
            counted:false, count:0, countError:null})
    const [loading, setLoading] = useState(false)
    const countProduct =async () => {
        setLoading(true)
        try{
            const countResp = await fetch('/api/products/count-products/by-category/',{
                method: 'POST',
                body: JSON.stringify(deleteParams),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const countResponse = await countResp.json()      
            
            if(Array.isArray(countResponse.productCount) && countResponse.productCount.length === 1){
                //console.log('count : ', countResponse.productCount[0].totalCount)
                setProductCount({...productCount, count:countResponse.productCount[0].totalCount, counted:true})
            }
        }
        catch(err){
            setProductCount({...productCount, countError:err, counted:true})
        }
        finally{
            //setProductCount({...productCount, counted:true})
            setLoading(false)
        }
        
    }

    const { counted, count, countError } = productCount

    useEffect(()=>{
        if(!counted){
            countProduct()
        }
    }, [counted])

    const deleteCategory = async () => {

    }

    const titleLabel = () => {        
        if(loading){
            if(!counted){
                return `Counting ${title} products...`
            }else{
                `Deleting ${title}...`
            }
            
        }
        if(!loading){
            if(count > 0){
                return `Cannot delete ${title} products.`
            }
            if(count === 0){
                return `Delete ${title}?`
            }
            if(countError){
                return `Error when counting ${title} products.`
            }
        }        
    }

    console.log('count : ', count)
    const canDelete = counted && count === 0 && !countError
    return (
        <FullscreenBaseModal>            
            <form onSubmit={deleteCategory} className=" w-full max-w-md bg-white rounded">
                <div className="py-4 px-2 flex justify-center items-center bg-red-200 rounded">
                    <p className="text-lg font-semibold text-rose-900">
                        {titleLabel()}
                    </p>
                </div>
                <div className="py-4 px-2 flex justify-center items-center bg-red-100 rounded">
                    <p className="text-base text-rose-800">
                        {count > 0?`${count} product(s) in ${title}`:''}
                    </p>
                </div>
                <div className="flex justify-end items-center py-2 mr-2">
                    <ButtonWithLoader
                        type='submit'
                        disabled={loading || count > 0 || countError}
                        loading={loading}
                        label={count > 0 || countError?'Cannot Delete':'Delete'}
                    />
                    <button
                        className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ml-1"
                        onClick={close}
                    >
                        Close
                    </button>
                </div>
            </form>            
        </FullscreenBaseModal>
    );
}