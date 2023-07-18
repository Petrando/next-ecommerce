import { FunctionComponent} from 'react'
import Head from 'next/head'

const ProductDetail:FunctionComponent = () => {
    return (
        <div className='min-h-screen bg-cyan-200'>
            <Head>
                <title>Product Detail</title>
            </Head>
            <p className='font-bold text-large'>
                Product Detail
            </p>
        </div>
    )
}

export default ProductDetail