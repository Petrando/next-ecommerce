'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import { LabelledInput, PasswordInput } from './Inputs';
import { ButtonWithLoader } from './Buttons';

export const LoginForm = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter();

    /*const { error } = router.query;

    useEffect(()=>{
        const errMsg = error === 'No user with a matching username was found.'?
            'Nama pengguna tidak ditemukan':'Password anda salah.'
        
        if(error){
            toast(errMsg, { hideProgressBar: false, autoClose: 2000, type: 'error' })
        }
    }, [error])
    */

    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
                        
        
        const signResult = await signIn('credentials', {
            redirect: true,
            callbackUrl:'/',
            username,
            password,
        })
        .then((res) => {
            console.log('sign in result : ')
            console.log(res);
            //toast('login success!', { hideProgressBar: false, autoClose: 2000, type: 'success' })
        })
        .catch((err) => {
            console.error(err);
        });
        
        console.log('sign result : ', signResult)
    }
    return (
        <>         
            <div className='w-full max-w-xs'>
                <form 
                    className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
                    onSubmit={handleSubmit}
                >
                    <div className='mb-4'>
                        <LabelledInput
                            label='Username'
                            id='username' 
                            type='text'                             
                            value={username} 
                            onChange={(e)=>{setUsername(e.target.value)}}
                            disabled={loading}
                            required={{
                                reqMessage:'Username still empty',
                                pattern:'[a-zA-Z]+[a-zA-Z ]+',
                                patternMessage:'Username consists of letters and space(s)'
                            }}                            
                        />                    
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password
                        </label>
                        <PasswordInput                             
                            id='password'           
                            value={password} 
                            onChange={(e)=>{setPassword(e.target.value)}}
                            disabled={loading}
                            required={{
                                reqMessage:'Password still empty',
                                minLength: 6,
                                patternMessage:'Password must at least 6 characters'
                                
                            }}                            
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <ButtonWithLoader
                            label='Log In'
                            loading={loading}  
                            disabled={loading}
                            type='submit'
                        />
                        
                        <div className='flex flex-col items-center'>
                            <p className='text-zinc-600 text-xs italic'>Not a member?</p>   
                            <Link href='/register' className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'>
                                Create Account
                            </Link>
                        </div>
                    </div>
                </form>
                <p className='text-center text-gray-500 text-xs'>
                    &copy;2023 Protection under Carmic Laws.
                </p>
            </div>
            <ToastContainer />
        </>     
    )
}