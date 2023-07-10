'use client'
import { useState, useEffect, useReducer, FunctionComponent, SyntheticEvent, ChangeEvent, Fragment } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { PageContainer } from '@/components/PageContainer'
import { ButtonWithLoader } from '@/components/Buttons'
import { getImgSrc } from '@/utils/api-access'
import { ICategoryData, ISubOption } from '../../../../../types'
import { categoryReducer, categoryState as initCategories, getCategoryStructures, getCategoryIds, CategoryActionKind } from '../reducers/categoryReducer';
import { initialItem, itemPropReducer, ItemActionKind } from '../reducers/itemPropsReducer';
import { XCircle } from '@/components/Icons'

const isAbsoluteUrl = (urlString:string) => {
    if (urlString.indexOf('http://') === 0 || urlString.indexOf('https://') === 0){
        return true
    }
    return false
}
export const EditProductForm:FunctionComponent = () => {
    const [categoryState, categoryDispatch] = useReducer(categoryReducer, initCategories)
    const [itemState, itemDispatch] = useReducer(itemPropReducer, initialItem)
    const [dotEnv, setDotEnv] = useState<{cloudName:string, apiKey:string, apiSecret:string}>({
        cloudName:'', apiKey:'', apiSecret:''
    })
    const [categoryInitialized, setCategoryInitialized] = useState(false)

    const [loading, setLoading] = useState(false)

    const { itemName, itemDescription, price, stock, isNewItem, productPic, newProductPic } = itemState

    const {mainCategories, categoryIdx, optionIdx, subOptionIdx} = categoryState
    const {categories, options, subOptions} = getCategoryStructures(categoryState)

    const searchParams = useSearchParams()
    //console.log('search params : ', searchParams.get('product'))
    const productString = searchParams.get('product')
    const product = productString?JSON.parse(productString):null
    
    const init = async () => {
        const { category } = product
        setLoading(true)
		try{
            const response = await fetch('/api/categories/list-categories')

            const categoryJson = await response.json()
            const categoryData = categoryJson.data;
            categoryDispatch({type:CategoryActionKind.SET_MAIN_CATEGORIES, payload:categoryData })

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

    const getProductImgSrc = async (productPic:string) => {
        const src = await getImgSrc(productPic)
        itemDispatch({type:ItemActionKind.SET_PIC, payload:src})
    }

    useEffect(()=>{
        if(product){
            const {productPic} = product
            getProductImgSrc(productPic)
        }
    }, [product])

    useEffect(()=>{
        init()
    }, [])

    useEffect(()=>{
        //assumption : itemState populated with items prop if itemName is not empty string
        if(product !== null && itemName === ''){
            itemDispatch({type:ItemActionKind.INIT_ITEM_FOR_EDIT, payload:product})
        }
    }, [product, itemName])

    useEffect(()=>{
        if(product!==null && mainCategories.length> 0){
            if(!categoryInitialized){
                console.log('this called!?')
                const {category} = product
                categoryDispatch({type:CategoryActionKind.INIT_FOR_EDIT, payload:category})
                setCategoryInitialized(true)
            }
            
        }
        
    }, [product, mainCategories.length, categoryInitialized])

    const handleChange = (name:ItemActionKind) => (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {		        
        const payload = e.target.type === 'number'?parseInt(e.target.value):e.target.value
        itemDispatch({type:name, payload})
	}

	const categoryOption = (ctg:ICategoryData, i:number) => {
		const {category} = ctg;
		return (
			<option value={i}>{category}</option>
		);
	}
	
	const changeCategory = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const idx:number = parseInt(evt.target.value)
        categoryDispatch({type:CategoryActionKind.SET_CATEGORY_IDX, payload:idx})
		
	}
	
	const renderOption = (subCtg:ISubOption, i:number) => <option key={i} value={i}>{subCtg.category}</option>

	const changeOption = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const idx:number = parseInt(evt.target.value)
		categoryDispatch({type:CategoryActionKind.SET_OPTION_IDX, payload:idx})
	}
	
	const renderSubOption = (subSubCtg:ISubOption, i:number) => <option key={i} value={i}>{subSubCtg.category}</option>

	const changeSubOption = (evt:ChangeEvent<HTMLInputElement|HTMLSelectElement>/*catIdx:number, subCatIdx:number*/) => {                
       const idx:number = parseInt(evt.target.value);
       categoryDispatch({type:CategoryActionKind.SET_SUBOPTION_IDX, payload:idx})
	}
    const submitForm = async (e:SyntheticEvent) => {}
    return (
        <PageContainer>
            <div className='flex flex-col justify-center items-center '>
                <h3 className='w-full max-w-2xl text-lg font-bold text-left mb-2'>
                    Edit Product
                </h3>
                <form 
                    className='w-full max-w-2xl'
                    noValidate                     
                    onSubmit={(e) => submitForm(e)}
                >
                    <div className='flex flex-wrap -mx-3 mb-2'>
                        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                            <label 
                                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' 
                                htmlFor='grid-categories'
                            >
                                Category
                            </label>
                            <div className='relative'>
                                <select 
                                    className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                    id='grid-categories'
                                    value={categoryIdx}
                                    onChange={(e)=>{changeCategory(e)}}
                                >                                    
                                    {
                                        categories.map((ctg, i)=>{
                                            return <Fragment key={ctg._id}>{categoryOption(ctg, i)}</Fragment>
                                        })
                                    }
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-options'>
                                Option
                            </label>
                            <div className='relative'>
                                <select 
                                    className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                    id='grid-options'
                                    value={optionIdx}
                                    onChange={(e)=>{changeOption(e)}}
                                >                                    
                                    {
                                        options.map((subCtg, i)=>{
                                            return <Fragment key={subCtg._id}>{renderOption(subCtg, i)}</Fragment>
                                        })
                                    }
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-sub-options'>
                                Sub Option
                            </label>
                            <div className='relative'>
                                <select 
                                    className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                    id='grid-sub-options'
                                    value={subOptionIdx}
                                    onChange={(e)=>{
                                        changeSubOption(e)
                                    }}
                                >
                                    {
                                        subOptions.length > 0?
                                        subOptions.map((subSubCtg, i)=>{
                                            return <Fragment key={subSubCtg._id}>{renderSubOption(subSubCtg, i)}</Fragment>
                                        }):
                                        <option>Not available</option>
                                    }
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full md:w-2/3 px-3 mb-6 md:mb-0'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-product-name'>
                                Product Name
                            </label>
                            <input 
                                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' 
                                id='grid-product-name' 
                                type='text' 
                                placeholder='Product Name' 
                                value={itemName}
                                onChange={handleChange(ItemActionKind.SET_NAME)}
                            />
                            {/*<p className='text-red-500 text-xs italic'>Please fill out this field.</p>*/}
                        </div>                        
                        <div className='w-full md:w-1/3 px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-last-name'>
                                Product Condition
                            </label>
                            <div className='w-full h-11 flex justify-start items-center'>
                                <div className='flex items-center'>
                                    <input 
                                        id='new-item-radio' 
                                        type='radio'                                         
                                        name='new-item-radio' 
                                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2' 
                                        checked={isNewItem}
                                        onChange={()=>{
                                            itemDispatch({type:ItemActionKind.SET_CONDITION, payload:true})
                                        }}                                        
                                    />
                                    <label htmlFor='new-item-radio' className='ml-2 text-sm font-medium text-gray-700'>New</label>
                                </div>
                                <div className='flex items-center ml-2'>
                                    <input 
                                        id='used-item-radio' 
                                        type='radio'                                         
                                        name='used-item-radio' 
                                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2' 
                                        checked={!isNewItem}
                                        onChange={()=>{
                                            itemDispatch({type:ItemActionKind.SET_CONDITION, payload:false})
                                        }}
                                    />
                                    <label htmlFor='used-item-radio' className='ml-2 text-sm font-medium text-gray-700'>Used</label>
                                </div>
                            </div>
                        </div>                                
                    </div>
                    
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-description'>
                                Product Description
                            </label>
                            <textarea 
                                rows={4} 
                                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                id='grid-description' 
                                placeholder='' 
                                value={itemDescription}
                                onChange={handleChange(ItemActionKind.SET_DESCRIPTION)}
                            />
                            <p className='text-gray-600 text-xs italic'>Make it as long and as crazy as you&apos;d like</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-2'>
                        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-price'>
                                Price
                            </label>
                            <input 
                                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                id='grid-price' 
                                type='number' 
                                placeholder='item price'
                                value={price}
                                onChange={handleChange(ItemActionKind.SET_PRICE)} 
                            />
                        </div>
                        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-stock'>
                                Stock
                            </label>
                            <input 
                                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                                id='grid-stock' 
                                type='number' 
                                placeholder='9999' 
                                value={0}
                                onChange={
                                    handleChange(ItemActionKind.SET_STOCK)
                                }
                            />
                        </div>
                    </div>                             
                    <div className='flex flex-wrap w-full mt-3 mb-2'>
                        <div className={`w-full ${newProductPic===null?'md:w-1/2':'md:w-1/3'} md:pr-3 mb-2 md:mb-0`}>
                            <label htmlFor='dropzone-file' className='flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100'>
                                <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                                    <svg aria-hidden='true' className='mb-3 w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path></svg>
                                    <p className='mb-2 text-sm text-gray-500 text-center'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                    <p className='text-xs text-gray-500 text-center'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
                        <div className={`w-full flex items-center justify-center ${newProductPic===null?'md:w-1/2':'md:w-2/3'} mb-2 md:mb-0 overflow-hidden flex flex-wrap`}>
                            <div className={`w-full ${newProductPic===null?'md:w-full':'md:w-1/2'} h-64 relative flex items-center justify-center p-2`}>
                            {
                                (productPic !== '' && isAbsoluteUrl(productPic))?                            
                                    <Image 
                                        fill
                                        className={`object-cover rounded-lg`}
                                        src={productPic} 
                                        alt={itemName}
                                    />:
                                        <p>Loading...</p>                                    
                            }
                            </div>
                            {
                                newProductPic !== null &&
                                    <div className={`w-full md:w-1/2 h-64 relative flex items-center justify-center p-2`}>
                                        <Image
                                            fill 
                                            className={`rounded-lg object-cover`}
                                            src={URL.createObjectURL(newProductPic)} 
                                            alt={`new ${itemName} pic`}
                                        />
                                        <div 
                                            className='flex items-center justify-center cursor-pointer absolute right-0 top-0'
                                            onClick={()=>{
                                                itemDispatch({type:ItemActionKind.SET_NEW_PIC, payload:null})
                                            }}
                                        >
                                            <XCircle />
                                        </div>
                                    </div>
                                    
                            }                       
                        </div>
                    </div>                     
                    <ButtonWithLoader
                        label='Update Product'
                        loading={false}
                        disabled={false}
                        type='submit'
                    />
                </form>
            </div>
        </PageContainer>
    )
}