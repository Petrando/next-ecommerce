'use client'
import {FunctionComponent} from 'react'
import Link from 'next/link';
import { ShopingCart as Cart } from '../Icons';
import { useSession } from 'next-auth/react';
import { ItemCount } from './ItemCount';

export const ShoppingCart:FunctionComponent = () => {
    const {data:session} = useSession()

    if(session && session.user.role === 'admin'){
        return <></>
    }

    return (
        <Link href="/user/cart">
            <button
                className="fixed bottom-1.5 left-1.5 flex items-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm text-center px-2 py-2"
            >
                <Cart />
                <ItemCount showIfItem={false}/>
            </button>
        </Link>
    )
}

