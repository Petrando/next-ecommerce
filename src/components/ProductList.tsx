'use client'

import { useEffect, useState, FunctionComponent } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroller';
import { Search } from './SearchProduct';
import { ProductCard } from '@/components/ProductCard'
import { SingleRowLoader } from './Loaders';
import { IProduct } from '../../types'
import { emptyCart } from '@/utils/helpers/cart-helper';

const pageSize = 10;
export const ProductList = () =>{
    const [products, setProducts] = useState<IProduct[]>([])
    const [productCount, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [displaySearch, setDisplaySearch] = useState(false)

    const { data:session } = useSession()
    const isAdmin = session && session.user.role === 'admin'

    useEffect(()=>{
        //This line is for emptying the card
        //remember to delete this line later
        //emptyCart(()=>{})
    }, [])

    const countProducts =async () => {
        setLoading(true)
        try{
            const response = await fetch('/api/products/count-products/', {
                method: 'POST',
                body: JSON.stringify({ countAll:false }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const productCount = await response.json()

            //console.log('products count : ', productCount)
            setCount(productCount.productCount)
            //setProducts(products.products)
        }
        catch(err){
            console.log('error counting products : ', err)
        }
        finally{
            setLoading(false)
        }
        
    }
    const getProducts = async () => {
        try{
            const response = await fetch('/api/products/list-all/', {
                method: 'POST',
                body: JSON.stringify({ order: 'asc', skip:offset * pageSize, limit:pageSize, sortBy: 'itemName' }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const newProducts = await response.json()

            console.log('products : ', products)
            setProducts(products.concat(newProducts.products))
            setOffset(offset + 1)
        }
        catch(err){
            console.log('error getting products : ', err)
        }
        finally{
            setLoading(false)
        }
    }

    const initData = async () =>{
        await countProducts()
        //await getProducts()
    }
    useEffect(()=>{
        initData()
    }, [])

    const toggleDisplaySearch = (newState:boolean) => {
        displaySearch!==newState && setDisplaySearch(newState);
				
		if(!newState){			
			setOffset(0)
			setProducts([])					
		}
    }
    const maxPage = Math.ceil(productCount/pageSize)
    return (
        <div className='w-screen min-h-screen h-auto bg sky-200'>
            {
                isAdmin &&
                <div className='flex items-center justify-end bg-white py-2 pr-4'>
                    <Link
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        href='/admin/products/add'
                    >
                        Add Product
                    </Link>

                </div>
            }
            
            <Search toggleSearchResultDisplayed={toggleDisplaySearch} searchResultDisplayed={displaySearch} />
            {
                !displaySearch &&
                <InfiniteScroll
                    loadMore={getProducts}
                    hasMore={offset <= maxPage}
                    loader={<SingleRowLoader />}
                >
                <div className="p-5 font-light border border-b-0 border-gray-200 flex items-center justify-around flex-wrap pb-4">                    
                {
                    products.length > 0 &&
                        products.map(p => <ProductCard key={p._id} product={p} cardIn='/' />)                 
                }
                </div>
                </InfiniteScroll>
            }
            
        </div>
    )
}