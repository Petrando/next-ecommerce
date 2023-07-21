'use client'

import { FunctionComponent} from 'react'
import { useSearchParams } from 'next/navigation'

export const ProductView:FunctionComponent = () => {
    const searchParams = useSearchParams()
    const productString = searchParams.get('product')
    const product = productString?JSON.parse(productString):null
        
    console.log('product : ', product)

    return (
        <div
                className="w-full flex flex-col md:flex-row "
            >
                <div className="flex justify-center items-start min-h-screen md:basis-3/4 bg-teal-200">

                </div>
                <div className="min-h-screen md:basis-1/4 bg-teal-100">

                </div>
        </div>
    )
}