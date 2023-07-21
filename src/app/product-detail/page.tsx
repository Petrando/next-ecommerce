import { FunctionComponent} from 'react'
import Head from 'next/head'
import { ProductView } from '@/components/pages/product-detail'

const ProductDetail:FunctionComponent = () => {
    return (
        <div className='min-h-screen bg-cyan-200'>
            <Head>
                <title>Product Detail</title>
            </Head>
            <ProductView />
        </div>
    )
}

export default ProductDetail