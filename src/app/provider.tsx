'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/dist/client/components/navigation';
import { SessionProvider } from 'next-auth/react';
import { CartContext } from '@/context/cartContext';
import { itemTotal } from '@/utils/helpers/cart-helper';
import { ShoppingCart } from '@/components/Cart';
import { IProduct } from '../../types';
type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
    const [itemCount, setCount] = useState(0);
    const [ productToDelete, setToDelete ] = useState<IProduct | null>(null); 

    const pathname = usePathname()

    console.log('itemCount : ', itemCount)

    useEffect(()=>{
      setCount(itemTotal())
    }, [])
    return <SessionProvider>
          <CartContext.Provider 
            value={{
              total:itemCount, 
                setItemCount:(newCount:number)=>{ setCount(newCount);},
                  productToDelete, 
                    setToDelete:(productToDelete:IProduct|null)=>{setToDelete(productToDelete);}
            }}
          >            
              {children}
              {(pathname === "/" || pathname === "/shop" || pathname.includes("/product/")) 
                && <ShoppingCart />}
              { /*productToDelete !== null &&
                <DeleteProductDialog
                    product={productToDelete}
                    closeDialog={()=>{setToDelete(null);}}
                />
                */
            }
          </CartContext.Provider>
        </SessionProvider>;
};
