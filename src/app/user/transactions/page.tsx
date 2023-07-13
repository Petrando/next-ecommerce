import { FunctionComponent} from 'react'
import Head from 'next/head'

const Transactions:FunctionComponent = () => {
    return (
        <div className='min-h-screen bg-cyan-200'>
            <Head>
                <title>User Transactions</title>
            </Head>
            <p className='font-bold text-large'>
                User Transactions
            </p>
        </div>
    )
}

export default Transactions