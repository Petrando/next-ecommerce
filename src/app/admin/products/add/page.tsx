import Link from 'next/link';
import React, { FunctionComponent} from 'react';
import { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext, PreviewData, } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { hasToken, isAdmin } from '@/utils/checkUser';
import { AddProduct as AddProductForm} from '@/components/admin/manage-products/add-product';

export interface ICloudinary {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
}

const AddProduct:FunctionComponent = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-start'>            
            <AddProductForm  />
        </div> 
    );
};

export const getServerSideProps:GetServerSideProps= async(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  
    const token = await isAdmin(context.req)//IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; } | NextRequest
    console.log('token : ', token)
    console.log('process.env : ', process.env)
  
    if(!token){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
  
    return { props: {
                cloudName:process.env.CLOUDINARY_CLOUD_NAME,
                apiKey:process.env.CLOUDINARY_API_KEY,
                apiSecret:process.env.CLOUDINARY_API_SECRET
            }}
}


export default AddProduct;
