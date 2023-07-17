'use client'

import { useState, useEffect, FunctionComponent, MouseEventHandler, FormEvent } from 'react';
import { ButtonWithLoader } from '@/components/Buttons';
import { FullscreenBaseModal } from '@/components/Modal';

interface IDeleteDialog {
    title: string; 
    ids:{
        categoryId:string,
        optionId:string,
        subOptionId:string
    };
    onSuccess: ()=>void;
    close: ()=>void;
}

export const DeleteDialog:FunctionComponent<IDeleteDialog> = ({title, ids, onSuccess, close}) => {
    const [productCount, setProductCount] = useState<{
        counted:boolean, count:number, countError:any}>({
            counted:false, count:0, countError:null})

    const [optionCount, setOptionCount] = useState<{
        counted:boolean, count:number, countError:any}>({
            counted:false, count:0, countError:null})

    const [loading, setLoading] = useState(false)

    const countProduct =async () => {
        setLoading(true)
        try{
            const countResp = await fetch('/api/products/count-products/by-category/',{
                method: 'POST',
                body: JSON.stringify(ids),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const countResponse = await countResp.json()      
            
            if(Array.isArray(countResponse.productCount) && countResponse.productCount.length === 1){
                //console.log('count : ', countResponse.productCount[0].totalCount)
                setProductCount({...productCount, count:countResponse.productCount[0].totalCount, counted:true})
            }
            else{
                setProductCount({...productCount, counted:true})
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

    const isDeleteOption = ids.optionId !== '0' && ids.subOptionId === '0'

    const { counted, count, countError } = productCount

    useEffect(()=>{
        if(!counted){
            countProduct()
        }
    }, [counted])

    const countOptions = async () => {
        setLoading(true)
        try{
            const countResp = await fetch('/api/categories/count-options/',{
                method: 'POST',
                body: JSON.stringify({categoryId:ids.categoryId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const countResponse = await countResp.json()      
            console.log('count options result : ', countResponse)
            setOptionCount({...optionCount, count:countResponse.optionCount, counted:true})
        }
        catch(err){
            setOptionCount({...optionCount, countError:err, counted:true})
        }
        finally{
            //setOptionCount({...optionCount, counted:true})
            setLoading(false)
        }
        
    }

    useEffect(()=>{
        if(counted && isDeleteOption){
            countOptions()
        }
    }, [counted, isDeleteOption])

    const deleteCategory = async (e:FormEvent<HTMLFormElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setLoading(true)
        const {categoryId, optionId, subOptionId} = ids
        const mainUrl = '/api/admin/manage-categories/delete/'
        const deleteUrl = (optionId === '0' && subOptionId === '0')?`category`:
            (optionId !== '0' && subOptionId === '0')?`option`:`sub-option`
        const body:{categoryId:string, optionId?:string, subOptionId?:string} = {
            categoryId
        }
        if(deleteUrl !== 'category'){
            body.optionId = optionId
            if(deleteUrl === 'sub-option'){
                body.subOptionId = subOptionId
            }
        }
        try{
            let response = await fetch(mainUrl + deleteUrl, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const deleteResponse = await response.json()
            console.log('deleteResponse : ', deleteResponse)
            if(typeof onSuccess === 'function'){
                onSuccess()
            }
            
        }catch(err){
            console.log('error deleting catgory/option/sub-option : ', err)
        }
        finally{
            setLoading(false)
        }
    }

    const titleLabel = () => {        
        if(loading){
            if(!counted){
                return `Counting products...`
            }else{
                if(isDeleteOption && !optionCount.counted){
                    return 'Counting category options...'
                }
                return `Deleting ${title}...`
            }
            
        }
        if(!loading){
            if(count > 0 || (isDeleteOption && optionCount.counted && optionCount.count < 2)){
                return `Cannot delete.`
            }
            if(count === 0){
                return `Delete ${title}?`
            }
            if(countError){
                return `Error when counting products.`
            }
            if(optionCount.countError){
                return 'Error when counting options'
            }
        }        
    }

    const description = () => {
        if(loading){
            if(!counted){
                return 'counting products...'
            }else if(isDeleteOption && !optionCount.counted){
                return 'counting category options'
            }
            else {
                return 'deleting....'
            }
        }else{
            if(count > 0){
                return `${count} products in ${title}`
            }
            if(!isDeleteOption){
                if(counted){                    
                    return !countError?'Ready to delete.':'cannot delete because error'
                }
            }else{
                if(optionCount.counted){
                    console.log(optionCount.count, ', ', optionCount.count < 2)
                    if(optionCount.count < 2){
                        return 'category must have at least 1 option'
                    }
                    return (!optionCount.countError && !countError)?
                        'ready to delete':'cannot delete because error'
                }
            }
        }
    }
        
    const disable = (countError || optionCount.countError) ||
        (count > 0 || (isDeleteOption && optionCount.counted && optionCount.count < 2)) ||
            loading
    console.log('disable : ', disable)
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
                        {description()}
                    </p>
                </div>
                <div className="flex justify-end items-center py-2 mr-2">
                    <ButtonWithLoader
                        type='submit'
                        disabled={disable}
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