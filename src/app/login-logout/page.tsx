import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/components/LoginForm'
import { LogoutButton } from '@/components/Buttons'
export default async function Login() {
    const session = await getServerSession(authOptions)
    console.log('session : ', session)

    return (
        <div className='w-full flex items-center justify-center h-screen bg-cyan-200'> 
            {
                session?
                    <LogoutButton label='Log out' />:
                    <LoginForm />
            }           
            
        </div>     
    )
}