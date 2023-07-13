'use client'

import { useState, useEffect, useReducer, ChangeEvent, SyntheticEvent, FunctionComponent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PageContainer } from '@/components/PageContainer';
import { LabelledInput } from '@/components/Inputs';
import { ButtonWithLoader } from '@/components/Buttons';
import { CategorySelection } from '../shared-components/CategorySelection';
import { ConditionRadio } from '../shared-components/ConditionRadio';
import { UpdatePic } from '../shared-components/UpdatePic';
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

    const changeSelection = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>, type:CategoryActionKind) => {
        const payload = parseInt(evt.target.value)
		categoryDispatch({type, payload})
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
                            onChange={(e)=>{changeSelection(e, CategoryActionKind.SET_CATEGORY_IDX);}} options={categories}
                        />
                        <CategorySelection label='Options' id='grid-option' value={optionIdx}
                            onChange={(e)=>{changeSelection(e, CategoryActionKind.SET_OPTION_IDX);}} options={options}
                        />
                        <CategorySelection label='Sub Options' id='grid-sub-option' value={subOptionIdx}
                            onChange={(e)=>{changeSelection(e, CategoryActionKind.SET_SUBOPTION_IDX);}} options={subOptions}
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
                                required={{reqMessage:'Must supply price', pattern:'[0-9]',
                                    patternMessage:'Price must be number'}}                              
                            />
                        </div>
                        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                            <LabelledInput label='Stock' id='stock' value={stock.toString()}
                                onChange={handleChange(ItemActionKind.SET_STOCK)}
                                labelStyle={formLabelStyle} inputStyle={formInputStype}
                                required={{reqMessage:'Must supply item stock', pattern:'[0-9]',
                                    patternMessage:'Stock must be number'                                    
                                }}                              
                            />
                        </div>
                    </div>                             
                    <UpdatePic newProductPic={newProductPic} itemName={itemName}
                        setNewPic={(newPic)=>{itemDispatch({type:ItemActionKind.SET_NEW_PIC, payload:newPic})}} 
                    />
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