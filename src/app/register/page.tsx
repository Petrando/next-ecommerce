'use client'

import { FormEvent, useState, useEffect, useRef } from 'react';
//import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { PasswordInput, LabelledInput } from '@/components/Inputs';
import { ButtonWithLoader } from '@/components/Buttons';
import { errorHandler } from '@/utils/helpers/errorHandler'
import { NextPage } from 'next';

async function createUser(username:string, email:string, password:string) {
    try{
        const response = await fetch('/api/auth/signup/', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
      
        const data = await response.json();
        if(data.error){
            throw new Error(errorHandler(data.error) || 'Something went wrong!');
        }

        return data
    }catch(err){
        console.log('fetch error : ')
        console.log(err)
        throw new Error(errorHandler(err) || 'Something went wrong!');
    }
    
}

const RegisterPage:NextPage = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSucces] = useState<boolean>(false)

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        try{
            
            const result = await createUser(name, email, password1);
            console.log('register result : ')
            console.log(result)
            toast('Register Success!', { hideProgressBar: false, autoClose: 2000, type: 'success' })            
            emptyFields()
            setSucces(true)
        }
        catch(err:any){            
            toast(err.message, { hideProgressBar: false, autoClose: 2000, type: 'error' })  
            setSucces(false) 
        }
        finally{
            setLoading(false)
        }
        
    }

    const emptyFields = () => {
        setName('')
        setEmail('')
        setPassword1('')
        setPassword2('')
    }

    return (
        <div className='w-full flex items-center justify-center h-screen bg-cyan-200'>
            <Head>
                <title>Register Page</title>
            </Head>
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
                            value={name} 
                            onChange={(e)=>{setName(e.target.value)}}
                            disabled={loading}
                            required={{
                                reqMessage:'Usernama must not empty',
                                pattern:'[a-zA-Z]+[a-zA-Z ]+',
                                patternMessage:'Username consists of letters and spaces'
                            }} 
                        />                        
                    </div>
                    <div className='mb-4'>
                        <LabelledInput
                            label='Email'
                            id='Email' 
                            type='email' 
                            value={email} 
                            onChange={(e)=>{setEmail(e.target.value)}} 
                            disabled={loading}
                            required={{
                                reqMessage:'Email must not empty'                                                                
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password (at least 6 characters)
                        </label>
                        <PasswordInput                                
                            id='password1'                
                            value={password1} 
                            onChange={(e)=>{setPassword1(e.target.value)}} 
                            disabled={loading}
                            required={{
                                reqMessage:'Password must not empty',
                                minLength: 6,
                                patternMessage:'Password at least 6 characters'
                                
                            }}   
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Confirm Password
                        </label>
                        <PasswordInput                                
                            id='password2'                
                            value={password2} 
                            onChange={(e)=>{setPassword2(e.target.value)}}    
                            required={{
                                reqMessage:'Please confirm your password',
                                pattern:`${password1}`,
                                patternMessage:'Password confirmation does not match'
                            }}
                        />
                        {/*<p className='text-red-500 text-xs italic'>Please choose a password.</p>*/}
                    </div>
                    <div className='flex items-center justify-between'>
                        <ButtonWithLoader
                            label='Register'
                            disabled={loading}
                            loading={loading}    
                            type='submit'
                        />
                        {
                            !loading ?
                                <div className='flex flex-col items-center'>
                                    <p className={`${success?'text-cyan-600':'text-zinc-600'} text-xs italic`}>
                                        {success?"Account created!":'Already a member?'}
                                    </p>   
                                    <Link href='/login' className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'>
                                        Log In
                                    </Link>
                                </div>:
                                    <>
                                    {
                                        /*<ThreeDotsContainer />*/
                                        <p>memproses....</p>
                                    }
                                    </>
                        }                   
                    </div>
                </form>
                <p className='text-center text-gray-500 text-xs'>
                    &copy;2023 All Rights maybe Registered.
                </p>
            </div>
        </div>
    )
}

export default RegisterPage