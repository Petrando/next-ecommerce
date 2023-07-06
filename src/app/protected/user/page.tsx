import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/Buttons'

export default async function UserPage() {
  const session = await getServerSession(authOptions)
  
  if(!session || session.user.role === 'admin'){
    redirect('/login-logout')
  }
  return (
    <div className='w-screen h-screen bg-sky-200 flex flex-col items-center justify-center'>
      <p className='font-bold italic'>User Page</p>
      <LogoutButton />
    </div>
  )
}
