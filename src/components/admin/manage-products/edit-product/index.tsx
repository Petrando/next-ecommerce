'use client'
import { FunctionComponent} from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'

export const EditProductForm:FunctionComponent = () => {
    const searchParams = useSearchParams()
    console.log('search params : ', searchParams.get('product') === 'string'?searchParams.get('product'):'')
    return (
        <PageContainer>
            <div className='flex flex-col justify-center items-center '>
                <h3 className='w-full max-w-2xl text-lg font-bold text-left mb-2'>
                    Edit Product
                </h3>
            </div>
        </PageContainer>
    )
}