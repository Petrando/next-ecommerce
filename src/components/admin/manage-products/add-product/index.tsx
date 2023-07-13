'use client'

import { useState, useEffect, useReducer, ChangeEvent, SyntheticEvent, FunctionComponent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PageContainer } from '@/components/PageContainer';
import { LabelledInput } from '@/components/Inputs';
import { ButtonWithLoader } from '@/components/Buttons';
import { CategorySelection } from '../shared-components/CategorySelection';
import { ConditionRadio } from '../shared-components/ConditionRadio';
import { categoryReducer, categoryState as initCategories, getCategoryStructures, getCategoryIds, CategoryActionKind } from '../reducers/categoryReducer';
import { initialItem, itemPropReducer, ItemActionKind } from '../reducers/itemPropsReducer';
import { formLabelStyle, formInputStype } from '../styles';

export const AddProduct:FunctionComponent = () => {    
    const [categoryState, categoryDispatch] = useReducer(categoryReducer, initCategories)
    const [itemState, itemDispatch] = useReducer(itemPropReducer, initialItem)

    const [dotEnv, setDotEnv] = useState<{cloudName:string, apiKey:string, apiSecret:string}>({
        cloudName:'', apiKey:'', apiSecret:''
    })

	const { itemName, itemDescription, price, stock, isNewItem, newProductPic } = itemState

    const {categoryIdx, optionIdx, subOptionIdx} = categoryState
    const {categories, options, subOptions} = getCategoryStructures(categoryState)

    const [loading, setLoading] = useState<boolean>(false)	
	
	const init = async () => {
        setLoading(true)
		try{
            const response = await fetch('/api/categories/list-categories')

            const categoryJson = await response.json()
            const categoryData = categoryJson.data;
            categoryDispatch({type:CategoryActionKind.SET_MAIN_CATEGORIES, payload:categoryData})

            const dotEnvResponse = await fetch('/api/admin/get-dot-env')
            const dotEnvData = await dotEnvResponse.json()
            const dotEnv = dotEnvData.data
            setDotEnv(dotEnv)
        }
        catch(err){

        }
        finally{
            setLoading(false)
        }
	}
	
	useEffect(() => {
		init();		
	}, []);

    const handleChange = (name:ItemActionKind) => (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {		        
        const payload = (e.target.id === 'price' || e.target.id === 'stock')?
            parseInt(e.target.value):e.target.value
        itemDispatch({type:name, payload})
	}
	
	const changeCategory = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const idx:number = parseInt(evt.target.value)
        categoryDispatch({type:CategoryActionKind.SET_CATEGORY_IDX, payload:idx})		
	}

	const changeOption = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const idx:number = parseInt(evt.target.value)
		categoryDispatch({type:CategoryActionKind.SET_OPTION_IDX, payload:idx})
	}		

	const changeSubOption = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>/*catIdx:number, subCatIdx:number*/) => {                
       const idx:number = parseInt(evt.target.value);
       categoryDispatch({type:CategoryActionKind.SET_SUBOPTION_IDX, payload:idx})
	}

    const submitForm = async (e:SyntheticEvent) => {
		e.preventDefault();
        const {cloudName} = dotEnv
        if(newProductPic){                          
            const formData = new FormData();
            formData.append('file', newProductPic);
            formData.append('upload_preset', 'nextcommerce');
            setLoading(true)
            const categoryObj = getCategoryIds(categoryState)
            
            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );
                //if this is edit form, remember to delete old item pic
               
                const newPublicId = response.data.public_id
                //console.log('item pic public id : ', newPublicId)
                const itemData = {
                    itemName, itemDescription, price, stock, isNewItem, productPic:newPublicId,
                    category:categoryObj
                }
                const addItemResponse = await fetch('/api/admin/products/add-product/',
                    {
                        method: 'POST',
                        body: JSON.stringify(itemData),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                const addItemData = await addItemResponse.json()
                console.log(addItemData)
                toast('New item added!', { hideProgressBar: false, autoClose: 2000, type: 'success' })
                itemDispatch({type:ItemActionKind.RESET_ITEM})
                
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        }  
        
	}
	
    
    return (        
        <PageContainer>
            <div className='flex flex-col justify-center items-center '>
                <h3 className='w-full max-w-2xl text-lg font-bold text-left mb-2'>
                    Add New Product
                </h3>
                <form 
                    className='w-full max-w-2xl'
                    noValidate                     
                    onSubmit={(e) => submitForm(e)}
                >
                    <div className='flex flex-wrap -mx-3 mb-2'>
                        <CategorySelection label='Category' id='grid-categories' value={categoryIdx}
                            onChange={(e)=>{changeCategory(e);}} options={categories}
                        />
                        <CategorySelection label='Options' id='grid-option' value={optionIdx}
                            onChange={(e)=>{changeOption(e);}} options={options}
                        />
                        <CategorySelection label='Sub Options' id='grid-sub-option' value={subOptionIdx}
                            onChange={(e)=>{changeSubOption(e);}} options={subOptions}
                        />
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full md:w-2/3 px-3 mb-6 md:mb-0'>
                            <LabelledInput label='Product Name' id='product-name' value={itemName} 
                                onChange={handleChange(ItemActionKind.SET_NAME)} disabled={loading}
                                required={{
                                    reqMessage:'Item name still empty'                                    
                                }}
                                labelStyle={formLabelStyle} inputStyle={formInputStype}                                                                                                                             
                            />
                        </div>                        
                        <div className='w-full md:w-1/3 px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-last-name'>
                                Product Condition
                            </label>
                            <div className='w-full h-11 flex justify-start items-center'>
                                <ConditionRadio id='new-item-radio' label='New' checked={isNewItem}
                                    onChange={(e)=>{itemDispatch({type:ItemActionKind.SET_CONDITION, payload:true})}}
                                />                                
                                <ConditionRadio id='used-item-radio' label='Used' checked={!isNewItem}
                                    onChange={(e)=>{itemDispatch({type:ItemActionKind.SET_CONDITION, payload:false})}}
                                />
                            </div>
                        </div>                                
                    </div>
                    
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <LabelledInput inputType='textarea' rows={4} id='product-description'
                                label='Description' labelStyle={formLabelStyle} inputStyle={formInputStype}
                                value={itemDescription} disabled={loading}
                                onChange={handleChange(ItemActionKind.SET_DESCRIPTION)}
                                required={{
                                    reqMessage:'Must write product description'
                                }}
                            />
                            <p className='text-gray-600 text-xs italic'>Make it as long and as crazy as you&apos;d like</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-2'>
                        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                            <LabelledInput label='Price($)' id='price' value={price.toString()}
                                onChange={handleChange(ItemActionKind.SET_PRICE)}
                                labelStyle={formLabelStyle} inputStyle={formInputStype}
                                required={{
                                    reqMessage:'Must supply price',
                                    pattern:'[0-9]',
                                    patternMessage:'Price must be number'                                    
                                }}                              
                            />
                        </div>
                        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                            <LabelledInput label='Stock' id='stock' value={stock.toString()}
                                onChange={handleChange(ItemActionKind.SET_STOCK)}
                                labelStyle={formLabelStyle} inputStyle={formInputStype}
                                required={{
                                    reqMessage:'Must supply item stock',
                                    pattern:'[0-9]',
                                    patternMessage:'Stock must be number'                                    
                                }}                              
                            />
                        </div>
                    </div>                             
                    <div className='flex flex-wrap w-full mt-3 mb-2'>
                        <div className='w-full md:w-1/2 md:pr-3 mb-2 md:mb-0'>
                            <label htmlFor='dropzone-file' className='flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100'>
                                <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                                    <svg aria-hidden='true' className='mb-3 w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path></svg>
                                    <p className='mb-2 text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                    <p className='text-xs text-gray-500'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input 
                                    id='dropzone-file' 
                                    type='file' 
                                    className='hidden' 
                                    onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>{	
                                        const imageFile = evt?.target?.files && evt.target.files[0];                                
                                        if(!imageFile){
                                            return
                                        }
                                        itemDispatch({type:ItemActionKind.SET_NEW_PIC, payload:imageFile})
                                    }}
                                />
                            </label>
                        </div>
                        <div className='w-full flex items-center justify-center md:w-1/2 mb-2 md:mb-0 h-64 overflow-hidden'>
                            {
                                newProductPic!==null ?
                                    <img 
                                        className='rounded-lg' 
                                        alt='item pic'
                                        src={URL.createObjectURL(newProductPic)} 
                                    />:
                                        <p>No pic yet...</p>
                            }                            
                        </div>
                    </div> 
                    {/*
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-password'>
                                Password
                            </label>
                            <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-password' type='password' placeholder='******************' />
                            <p className='text-gray-600 text-xs italic'>Make it as long and as crazy as you'd like</p>
                        </div>
                    </div>
                    */}
                    <ButtonWithLoader
                        label='Create Product'
                        loading={loading}
                        disabled={loading}
                        type='submit'
                    />
                </form>
            </div>
        </PageContainer>        
    );
}