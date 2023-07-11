'use client'

import { useContext, FunctionComponent } from "react";
import { CartContext } from "@/context/cartContext";

interface IItemCount {
    showIfItem:boolean;
}
export const ItemCount:FunctionComponent<IItemCount> = ({ showIfItem }) => {
    
    const {total} = useContext(CartContext) || {};
    
    const countEl = () => {
        return (
            <span className={`bg-zinc-700 group-hover:bg-zinc-700 text-white-600 group-hover:text-white-600 text-sm font-medium rounded-lg px-1.5`}>
                {total?total:''}
            </span>
        );
    }
    if(showIfItem){
        if(total && total > 0){
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