import Image from 'next/image'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log('session : ', session)
  console.log('something....')
  return (
    <div className='w-screen h-screen bg-sky-200 flex items-center justify-center'>
      <p className='font-bold italic'>Hellooo</p>
    </div>
  )
}
