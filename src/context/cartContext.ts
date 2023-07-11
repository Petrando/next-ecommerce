import { createContext } from 'react';
import { IProduct } from '../../types';

interface IContextValue {
    total:number;
    setItemCount:(count:number)=>void;
    productToDelete:IProduct|null;
    setToDelete:(product:IProduct|null)=>void

}

export const CartContext = createContext<IContextValue|null>(null);