'use client'

import { useContext, FunctionComponent } from "react";
import { CartContext } from "@/context/cartContext";

interface IItemCount {
    showIfItem:boolean;
}
export const ItemCount:FunctionComponent<IItemCount> = ({ showIfItem }) => {
    
    const {total} = useContext(CartContext) || {};
    console.log('total  : ', total)
    
    const countEl = () => {
        return (
            <span className={`bg-zinc-700 group-hover:bg-zinc-700 text-white-600 group-hover:text-white-600 text-sm font-medium rounded-lg px-1.5`}>
                {total?total:''}
            </span>
        );
    }
    if(showIfItem){
        if(total && total > 0){
            console.log('here')
            return countEl();
        }        

        return <></>
    }
    
    return (
        <>
        {
            countEl()    
        }
        </>
    );
}