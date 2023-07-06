'use client'
import { useEffect } from "react"
export default function TestAPIAccess() {

    const accessProtectedApi = async () => {
        try{
            const response = await fetch('/api/protected/user')
            const responseData = await response.json()

            console.log(responseData)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        accessProtectedApi()
    }, [])
    return (
        <div className='w-full flex items-center justify-center h-screen bg-cyan-200'> 
            <p className='font-bold text-lg'>Test API access</p>
            
        </div>     
    )
}