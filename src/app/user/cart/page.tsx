import { FunctionComponent} from 'react'
import Head from 'next/head'

const Cart:FunctionComponent = () => {
    return (
        <div className='w-full flex items-center justify-center h-screen bg-cyan-200'>
            <Head>
                <title>User Cart</title>
            </Head>
            <p className='font-bold text-large'>
                User Cart
            </p>
        </div>
    )
}

export default Cart