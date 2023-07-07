
import Head from 'next/head'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { LoginForm } from '@/components/LoginForm';


export default async function Login() {
    return (
        <div className='w-full flex items-center justify-center h-screen bg-cyan-200'>            
            <LoginForm />
        </div>     
    )
}
