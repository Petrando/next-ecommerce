
import React, { FunctionComponent} from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AddProduct as AddProductForm} from '@/components/admin/manage-products/add-product';

const AddProduct:FunctionComponent = async () => {
    const session = await getServerSession(authOptions)
    
    if(!session || session.user.role === 'user'){
      redirect('/')
    }
    return (
        <div className='w-screen h-screen flex justify-center items-start'>            
            <AddProductForm  />
        </div> 
    );
};

export default AddProduct;
