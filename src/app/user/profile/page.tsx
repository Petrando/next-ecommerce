import { FunctionComponent} from 'react'
import Head from 'next/head'

const Profile:FunctionComponent = () => {
    return (
        <div className='min-h-screen bg-cyan-200'>
            <Head>
                <title>User Profile</title>
            </Head>
            <p className='font-bold text-large'>
                User Profile
            </p>
        </div>
    )
}

export default Profile