'use client'
import { FunctionComponent } from 'react';
import { useSession } from 'next-auth/react';
import { FullscreenBaseModal } from '@/components/Modal';
import { ProductToDeleteCard } from '@/components/ProductCard';
import { IProduct } from '../../../../../types';


export interface IDeleteProductDialog {
    product:IProduct;
    closeDialog:()=>void;
}

export const DeleteProductDialog:FunctionComponent<IDeleteProductDialog> = ({product, closeDialog}) => {
    const {data:session} = useSession()
    const isAdmin = session?.user.role === 'admin'

    if(!isAdmin){
        return <></>
    }
    
    return (
        <FullscreenBaseModal>
            <ProductToDeleteCard
                product={product}
                closeDialog={closeDialog}
            />
        </FullscreenBaseModal>
    )
}