import { useState, useContext, FunctionComponent } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { ProductPic } from './ProductPic';
//import { isAuthenticated } from '../../../api/api-auth';
//import { deleteProduct } from '../../../api/api-admin.js';
import { CartContext } from '@/context/cartContext';
//import { Edit, Trash, ShopingCart, Info, PlusCircle, MinusCircle, XCircle } from '../Icons';
import { Edit, Trash, ShopingCart, Info, PlusCircle, MinusCircle, XCircle } from '../Icons';
import { itemInCart, addItem, updateItem, removeItem } from '@/utils/helpers/cart-helper';
import { IProduct, ICategoryData } from '../../../types';
import { IDeleteProductDialog } from '../admin/manage-products/delete-product';

interface ILinkButton {
    product:IProduct;
}
const EditButton:FunctionComponent<ILinkButton> = ({ product }) => {
    let { setToDelete } =  useContext(CartContext) || {};
    return (
        <Link 
            href={{
                pathname:"/admin/products/edit",
                query: {product:JSON.stringify(product)}
            }}             
            className="flex items-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-xs px-1 py-1 text-center"    
            onClick={()=>{
                if(setToDelete){
                    setToDelete(null)
                }
            }}
        >            
            <Edit dimensions="w-5 h-5" />
            Edit
        </Link>
    );
}

const DetailButton:FunctionComponent<ILinkButton> = ({product}) => {
    return (
        <Link 
            href={{
                pathname:"/product-detail",
                query: {product:JSON.stringify(product)}
            }} 
            className="flex items-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-xs px-1 py-1 text-center"
        >                   
            <Info dimensions="w-5 h-5" />
            Details            
        </Link>
    )
}
interface IProductCard {
    product: IProduct;
    cardIn: string;
}

export const ProductCard:FunctionComponent<IProductCard> = ({ product, cardIn }) => {
    const [isInCart, setInCart] = useState((itemInCart(product._id)));
    const {itemName, itemDescription, myCategory, price, stock, isNewItem, productPic} = product;

    const {data:session, update, status} = useSession()
    const isAdmin = session?.user.role === 'admin';

    const pathname = usePathname()
    
    let { total, setItemCount, setToDelete } =  useContext(CartContext) || {};

    const showIsNew = () => {
        const color = isNewItem?"blue":"gray";
        return (
            <span className={`bg-${color}-100 text-${color}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}>
                {isNewItem?"New":"Used"}
            </span>            
        );
    }

    const showStock = () => {
        const color = stock > 0?"blue":"orange";
        return (
            <span className={`bg-${color}-100 text-${color}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}>
                {stock > 0?"Available":"Out of stock"}
            </span>            
        )
    }

    const cartButton = () => {
        const canAddToCart = !isAdmin && !isInCart;        
        
        const hoverColor = canAddToCart?"hover:bg-blue-800":"";
        const colorAndBg = canAddToCart?"text-white bg-blue-700":"text-green-600 bg-blue-200";
        return (
            <>
            <button 
                className={`flex items-center ${colorAndBg} ${hoverColor} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-1 py-1 text-center`}
                onClick={()=>{
                    if(canAddToCart){   
                        console.log('can add')     
                        addItem(product, () => {});
                        if(typeof setItemCount !=='undefined' && typeof total !== 'undefined'){
                            setItemCount(total + 1);
                        }
                        
                        setInCart(true);
                    }
                }}
            >
                    <ShopingCart dimensions="w-5 h-5" />
                    {canAddToCart?"Add":"In Cart"}                             
            </button>
            {
                !canAddToCart &&
                <button 
                    className={`flex items-center text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-1 py-1 text-center`}
                    onClick={()=>{
                        removeItem(product._id, () => {});
                        if(typeof setItemCount !=='undefined' && typeof total !== 'undefined'){
                            setItemCount(total - 1)
                        }
                        
                        setInCart(false);
                    }}
                >
                        <MinusCircle dimensions="w-5 h-5" />
                        Remove                             
                </button>
            }            
            </>
        );
    }

    const displayCategoryStructure = () => {	
		const {withSubOptions, withoutSubOptions} = myCategory;	
		const myCategoryStructure = withSubOptions.length>0?withSubOptions[0]:withoutSubOptions[0];
        //const noOptions = !myCategoryStructure.options
        //const noSubOptions = noOptions || !myCategoryStructure.options.
		//const mySubOptionText = !myCategoryStructure.options?"":
            //(myCategoryStructure.options && !myCategoryStructure.options.)
        //typeof myCategoryStructure.options.options.category!=="undefined"?
								   //" > " + myCategoryStructure.options.options.category:"";	
        
        const myOptionText = myCategoryStructure.options?myCategoryStructure.options.category:'';
        const mySubOptionText = (myCategoryStructure.options && myCategoryStructure.options.options)?
            (" > " + myCategoryStructure.options.options.category):''
		return (
			<p className="text-base italic font-semibold text-slate-600">
				{myCategoryStructure.category + " > " + myOptionText + mySubOptionText}
			</p>
		) 											   
	}

    const inProductView = pathname?.includes('/product/');

    const lgWidth =  pathname === "/"?"lg:w-1/4":pathname === "/shop"?"lg:w-1/3":"lg:w-full";    
    const mdWidth =  !inProductView?"md:w-1/2":"md:w-full"
    //console.log("lgWidth : ", lgWidth);
    return (
        <div className={`w-full ${mdWidth} ${lgWidth} ${(inProductView && cardIn !== "ProductRelated")?"max-w-lg":"max-w-sm"} bg-opacity-0 p-2`}>
            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                <div className="w-full flex items-center justify-center">
                    <ProductPic productPic={productPic} />
                </div>
                <div className="px-5 flex flex-col items-center">
                    <div className="flex justify-center items-center">
                        { showIsNew() }{ showStock() }
                    </div>
                    <span>
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                            {itemName}
                        </h5>
                    </span>
                    {
                        inProductView && !cardIn && displayCategoryStructure()
                    }
                    {
                        inProductView && !cardIn && 
                        <p className="text-base font-semibold text-gray-700">
                            {itemDescription}
                        </p>
                    }                
                    <span className="text-2xl font-bold text-gray-900">${price}</span>
                    {
                        isAdmin &&
                        <span className={`bg-lime-400 text-gray-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}>
                            Added {moment(product.createdAt).fromNow()}
                        </span>
                    }                 
                    {/*
                    <div className="flex items-center mt-2.5 mb-5">
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3">5.0</span>
                    </div>
                    */}
                    
                </div>
                <div className="w-full flex justify-end items-center mt-4 py-2 pr-2 bg-purple-300">
                    {
                        isAdmin?
                        <>
                            <EditButton product={product} />
                            <button
                                className="flex items-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-1 py-1 text-center"
                                onClick={()=>{
                                    if(typeof setToDelete !== 'undefined'){
                                        setToDelete(product);                                    
                                    }
                                    
                                }}
                            >
                                    <Trash dimensions="w-5 h-5" />
                                    Delete
                            </button>
                        </>
                        :
                        cartButton()
                    }
                    {
                        ( !inProductView || (inProductView && cardIn==="ProductRelated"))&&
                            <DetailButton product={product} />
                    }                    
                </div>
            </div>
        </div>
    )
}

export const ProductToDeleteCard:FunctionComponent<IDeleteProductDialog> = ({ product, closeDialog}) => {
    const [ deleteState, setDeleteState ] = useState(
        {isLoading:false, deleteComplete:false, deleteResult:""});
    const { itemName, itemDescription, myCategory, price, stock, isNewItem, productPic } = product;  
    let { setToDelete } =  useContext(CartContext) || {}  

    const { isLoading, deleteComplete, deleteResult } = deleteState;

    return (
        <div className="w-full md:w-1/2 lg:w-1/4 max-w-sm bg-white rounded-lg shadow-md">
            <div className="w-full flex items-center justify-center">
                <ProductPic productPic={productPic} />
            </div>
            <div className="px-5 pb-5 flex flex-col items-center">              
                <span>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                        {
                            isLoading?`Deleting ${itemName}....`:
                                deleteComplete?`${itemName} ${deleteResult}`:
                                    `Delete ${itemName}?`
                        }                        
                    </h5>
                </span>
                <p className="text-base font-semibold text-gray-700">
                    {itemDescription}
                </p>
                <span className="text-2xl font-bold text-gray-900">${price}</span>
                <span className={`bg-lime-400 text-gray-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}>
                    Added {moment(product.createdAt).fromNow()}
                </span>             
            </div>
            <div className="w-full flex justify-end items-center py-2 pr-2 bg-purple-300">
                {
                    !deleteComplete &&
                    <button
                        className={`flex items-center text-white ${!isLoading?"bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300":"bg-zinc-600"}  font-medium rounded-lg text-xs px-1 py-1 text-center`}
                        disabled={isLoading}
                        onClick={async ()=>{
                            setDeleteState({...deleteState, isLoading:true});
                            try{
                                const response = await fetch('/api/admin/products/delete-product/',
                                {
                                    method: 'POST',
                                    body: JSON.stringify({_id:product._id}),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                const deleteResponse = await response.json()
                                console.log('deleteResponse : ', deleteResponse)
                                if(typeof setToDelete === 'function'){
                                    setToDelete(null)
                                }                                                                
                            }
                            catch(err){

                            }
                            finally{
                                setDeleteState({...deleteState, isLoading:false})
                            }
                        }}
                    >
                            <Trash dimensions="w-5 h-5" />
                            DELETE
                    </button>
                }
                
                <button
                    className="flex items-center text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-1 py-1 text-center"
                    onClick={()=>{closeDialog();}}
                >
                        <XCircle dimensions="w-5 h-5" />
                        Close
                </button>
                <EditButton product={product} />
            </div>
        </div>
    )
}