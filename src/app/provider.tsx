'use client';

import { useState, useEffect, FunctionComponent } from 'react';
import { usePathname } from 'next/dist/client/components/navigation';
import { SessionProvider } from 'next-auth/react';
import ScrollToTop from 'react-scroll-to-top';
import { CartContext } from '@/context/cartContext';
import { itemTotal } from '@/utils/helpers/cart-helper';
import { ShoppingCart } from '@/components/Cart';
import { DeleteProductDialog } from '@/components/admin/manage-products/delete-product';
import { ArrowSmallUp } from '@/components/Icons';
import { IProduct } from '../../types';
type Props = {
  children?: React.ReactNode;
};

const ScrollArrow:FunctionComponent = () => {
  return (
      <div className="bg-zinc-800 text-white h-full rounded-lg flex items-center justify-center">
          <ArrowSmallUp />
      </div>
  );
}

export const NextEcommerceProvider:FunctionComponent = ({ children }: Props) => {
    const [itemCount, setCount] = useState(0);
    const [ productToDelete, setToDelete ] = useState<IProduct | null>(null); 

    const pathname = usePathname()

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
              { productToDelete !== null &&
                <DeleteProductDialog
                    product={productToDelete}
                    closeDialog={()=>{setToDelete(null);}}
                />                
              }
              {
                (pathname !== "/login" && pathname !== "/register" && pathname !== "/about-me") &&
                    <ScrollToTop smooth component={<ScrollArrow />}/>
            }
          </CartContext.Provider>
        </SessionProvider>;
};
