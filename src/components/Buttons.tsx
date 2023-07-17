'use client'
import { FunctionComponent, MouseEventHandler } from 'react'
import {Spinner} from './LoadingSpinner'
import { PlusCircle } from './Icons'
import { signOut } from 'next-auth/react'

interface IButtonWithLoader {
    label: string;
    loading: boolean;
    disabled?: boolean;
    type: 'button' | 'submit' | 'reset' | undefined
    onClick?:()=>void;
}

export const ButtonWithLoader:FunctionComponent<IButtonWithLoader> = ({label, loading, disabled, type, onClick}) => {
    return (
        <button 
            className={`${(disabled && !loading)?'bg-zinc-500':'bg-blue-500'} ${(!disabled && !loading)&&'hover:bg-blue-700'} flex flex-col items-center text-white font-bold py-2 px-4 rounded ${!loading && 'focus:outline-none focus:shadow-outline'} relative`} 
            type={type}                            
            disabled={disabled?disabled:false}
            onClick={()=>{
                if(typeof onClick === 'function'){
                    onClick()
                }
            }}
        >
            
            <p className={`h-auto overflow-hidden ${loading?'opacity-0':'opacity-100'}`}>
                { label }
            </p>
            {
                loading &&
                    <div className='w-full h-full absolute left-0 top-0 flex items-center justify-center'>
                        <Spinner />
                    </div>
            }            
        </button>
    )
}

interface IAddButton {
    title: string;
    margin?: number;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?:boolean;
    loading?:boolean;
}

export const AddButton:FunctionComponent<IAddButton> = ({title, margin, onClick, disabled, loading}) => {
    const buttonDisable = disabled?disabled:false;

    const bg = !buttonDisable?"bg-blue-500":"bg-neutral-500";
    const hoverStyle = !buttonDisable?"hover:bg-blue-700":"";
    const focusStyle = !buttonDisable?"focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50":"";    
    
    return (
        <button 
            type="button" 
            className={
                `${bg} ${hoverStyle} text-white font-bold ${focusStyle} px-2 py-2 text-center inline-flex ` +
                    `items-center ${margin && margin} rounded overflow-hidden`
            }
            onClick={(e)=>{onClick(e);}}    
            disabled={buttonDisable}
        >                        
            <PlusCircle />
            {" "}{title}                
            
        </button>
    );
}

interface ILogoutBtn {
    label: string;
}
export const LogoutButton:FunctionComponent<ILogoutBtn> = ({label}) => {
    return (
        <button
            className={`bg-blue-500 hover:bg-blue-700 flex flex-col items-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline relative`}
            onClick={()=>{signOut()}}
        >
            {label===''?'Log out':label}
        </button>
    )
}