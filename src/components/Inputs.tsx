'use client'

import { useRef } from 'react'
import { HTMLInputTypeAttribute, ChangeEventHandler, FunctionComponent, useState, ReactNode } from 'react';
import { Eye, EyeSlash, MagnifyingGlass, Reload, ReloadArrow, ChevDown, ChevUp } from './Icons';

interface Required {
    reqMessage:string,
    pattern?: string,
    patternMessage?:string,
    minLength?:number
}

interface InputParams  {
    id?:string|null; 
    type?:HTMLInputTypeAttribute; 
    height?:Number|string; 
    placeholder?:string; 
    value?:string; 
    disabled?:boolean; 
    required?: Required; 
    onChange?: ChangeEventHandler<HTMLInputElement>
}
export const Input:FunctionComponent<InputParams> = ({id, type, height, placeholder, value, disabled, required, onChange}) => {
    const inputRef = useRef(null)
    //inputRef?.current?    
    /*
    useEffect(()=>{
        if(inputRef?.current){
            if(required){
                if(required.pattern){
                    inputRef.current.pattern = required.pattern
                }
                
            }
        }
    }, [inputRef?.current])*/
    return (
        <input 
            className={`shadow appearance-none border rounded w-full ${height?height:''} py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} 
            id={id?id:''} 
            type={type?type:'text'} 
            placeholder={placeholder?placeholder:''} 
            value={value?value:''} 
            onChange={(e)=>{
                if(typeof onChange === 'function'){
                    onChange(e)
                }
            }}
            disabled={disabled?disabled:false}
            required={required?true:false}
            pattern={required?.pattern?required.pattern:'^(?!Enter Code$).+'}
            onInvalid={(e: React.ChangeEvent<HTMLInputElement>) => { 
                const { valueMissing, patternMismatch } = e.target.validity
                if(valueMissing){
                    e.target.setCustomValidity(required?.reqMessage?required.reqMessage:'')
                }
                if(patternMismatch){
                    e.target.setCustomValidity(required?.patternMessage?required.patternMessage:'Pola tidak cocok')
                }
                
            }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {  
                const {patternMismatch} = e.target.validity
                if(patternMismatch){
                    e.target.setCustomValidity(required?.patternMessage?required.patternMessage:'Pola tidak cocok')
                }else{
                    e.target.setCustomValidity('')
                }              
                
            }}        
            ref={inputRef}
        />
    );
}

interface InputLabel {
    label:string
}

type LabelledInputParams = InputLabel & InputParams

export const LabelledInput:FunctionComponent<LabelledInputParams> = ({label, ...rest}) => {
    return (
        <>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={rest?.id?rest.id:''}>
                { label }
            </label>
            <Input {...rest} />
        </>
    )
}

interface PasswordInputParams {
    id?:string, placeholder?:string, value:string, disabled?:boolean, 
        required?:Required, onChange?:ChangeEventHandler<HTMLInputElement>
}

export const PasswordInput:FunctionComponent<PasswordInputParams> = ({id, placeholder, value, disabled, required, onChange}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <span className='relative'>
        <span 
            className='absolute inset-y-0 right-0 flex items-center pr-2' 
            onClick={()=>{setShowPassword(!showPassword);}}
        >
            {showPassword?<Eye />:<EyeSlash />}
        </span>
        <input 
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
            id={id} 
            type={showPassword?'text':'password'} 
            placeholder={placeholder?placeholder:showPassword?'password':'********'}                          
            required={required?true:false}
            pattern={required?.pattern?required.pattern:'^(?!Enter Code$).+'}
            minLength={required?.minLength?required.minLength:0}
            onInvalid={(e: React.ChangeEvent<HTMLInputElement>) => { 
                if(!required){
                    return
                }         
                const { valueMissing, patternMismatch, tooShort } = e.target.validity
                if(valueMissing ){
                    e.target.setCustomValidity(required?.reqMessage?required.reqMessage:'')
                }
                if(patternMismatch || tooShort){
                    e.target.setCustomValidity(required?.patternMessage?required.patternMessage:'Pola tidak cocok')
                }
                
                
            }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {   
                const { patternMismatch, tooShort } = e.target.validity            
                if(patternMismatch || tooShort){
                    e.target.setCustomValidity(required?.patternMessage?required.patternMessage:'Pola tidak cocok')
                }else{
                    e.target.setCustomValidity('')
                }
            }}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                if(typeof onChange === 'function'){
                    onChange(e)
                }
                
            }}
        />
        </span>
    )
}

interface ISearchInput {
    placeholder?:string; 
    value?: string; 
    onChange?: ChangeEventHandler<HTMLInputElement>,
    searchClick? :()=>void
}

export const SearchInput:FunctionComponent<ISearchInput> = ({placeholder, value, onChange, searchClick}) => {
    return (
        <div className='w-full flex items-center bg-gray-200 rounded-md'>
            <div className='pl-2' onClick={()=>{
                if(!searchClick){
                    return;
                }
                searchClick();}}
            >
                <MagnifyingGlass />
            </div>
            <input
                className='w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2'
                id='search' 
                type='text' 
                value={value && value}
                onChange={(e)=>{
                    if(onChange){
                        onChange(e);
                }}}
                placeholder={`${placeholder?placeholder:'Search Category'}`} 
            />
        </div>
    );
}

export const SelectInput = ({ selection, selectionRender, controlValue, controlChange }:{
    selection:any[], selectionRender:(elm:any, i:number)=>ReactNode|JSX.Element, controlValue:number|string, 
        controlChange:ChangeEventHandler<HTMLSelectElement>
}) => {
    const [focus, setFocus] = useState(false);   

    return (
        <div className='relative'>
            <select 
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'                     
                value={controlValue}
                onChange={controlChange}
                onClick={()=>{setFocus(true);}}
                onBlur={()=>{setFocus(false);}}                
            >                                    
                { selection.map(selectionRender) }
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700 flex items-center justify-center'>
                <div className={`${focus?'bg-white':'bg-gray-200'} rounded`}>
                    {focus?<ChevUp />:<ChevDown />}
                </div>
            </div>
        </div>
    );
}

interface IResetableSearch {
    placeholder:string;
    value:string; 
    onChange: (e:any)=>void; 
    searchClick: ()=>void; 
    resetSearch: ()=>void; 
    searchDisabled: boolean; 
    searched: boolean;
}

export const ResetableSearch:FunctionComponent<IResetableSearch> = ({placeholder, value, onChange, searchClick, resetSearch, searchDisabled, searched}) => {
    return (
        <div className='w-full flex items-center bg-gray-200 rounded-md'>         
            <input
                className='w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2'
                id='search' 
                type='text' 
                value={value && value}
                onChange={(e)=>{onChange(e);}}
                placeholder={`${placeholder?placeholder:'Search Category'}`} 
            />
            <div className='' onClick={()=>{
                if(!searchClick){
                    return;
                }
                if(searchDisabled){
                    return
                }
                searchClick();}}
            >
                <MagnifyingGlass disabled={searchDisabled} />
            </div>
            {
                searched &&
                <div className='' onClick={()=>{resetSearch();}}>
                    <ReloadArrow />
                </div>
            }            
        </div>
    )
}