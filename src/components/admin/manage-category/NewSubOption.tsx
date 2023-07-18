'use client'
import { FunctionComponent, ChangeEventHandler, MouseEventHandler } from 'react';
import { Input } from '@/components/Inputs';
import { Check, Edit, XMark, Trash } from '@/components/Icons';
import { ListDot } from '@/components/ListDot';

interface INewSubOption {
    placeholder: string; 
    value: string; 
    onChange: ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement>;// | ((value: string)=>void);
    okClick?: ()=>void;
    cancelClick: MouseEventHandler<HTMLButtonElement>;
    forNewOption:boolean; 
    isEdit?: boolean; 
    startEdit?: ()=>void; 
    endEdit?: ()=>void;
    isNew?: boolean;
}

export const NewSubOption:FunctionComponent<INewSubOption> = ({
    placeholder, value, onChange, okClick, cancelClick, forNewOption, isEdit, startEdit, endEdit, 
        isNew/*isNew is optional, just to mark if this is a new element to be added to the list*/ }) => 
{
    
    /*
        forNewOption is when called as part of add new option form....
        if called with forNewOption, must also supply isEdit, startEdit, endEdit
        otherwise must provide okClick
    */
    
    const optionInput = () => {
        
        return (
            <Input
                height="h-8"
                placeholder={placeholder}
                value={value}
                onChange={(e)=>{
                    if(onChange){
                        onChange(e)
                    }}}                
            />
        );
    }

    const hoverStyle = value===""?"":"hover:bg-emerald-700";
    const focusStyle = value===""?"":"focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50";
    return (        
        <div className={"flex justify-start rounded-md px-2 py-2 my-2"}>
            <ListDot isNew={isNew?isNew:false}/>
            {
                forNewOption &&
                (
                    isEdit?
                        optionInput():
                            <div className={`flex-grow font-medium px-2`}>
                                {value}
                            </div>
                )
            }          
            {
                !forNewOption && optionInput()
            }  
            <div className="flex justify-end text-sm font-normal text-gray-500 tracking-wide">
                <button 
                    type="button" 
                    className={`${value===""?"bg-zinc-500":"bg-emerald-500"} ${hoverStyle}  text-white font-bold ${focusStyle} px-1 py-1 text-center inline-flex items-center rounded`}
                    disabled={value===""}
                    onClick={()=>{
                        if(forNewOption){
                            if(isEdit){
                                if(endEdit){
                                    endEdit();
                                }                                
                            }else{
                                if(startEdit){
                                    startEdit();
                                }                                
                            }
                        }else{
                            if(okClick){
                                okClick();
                            }                            
                        }
                    }}
                >
                    {
                        forNewOption?
                            ( isEdit?<Check />:<Edit /> )
                                :<Check />
                    }                            
                </button>
                <button 
                    type="button" 
                    className={`bg-pink-500 hover:bg-pink-700 text-white font-bold focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 px-1 py-1 text-center inline-flex items-center rounded`}
                    onClick={cancelClick}
                >
                    {
                        forNewOption?(isEdit?<XMark />:<Trash />):<Trash />
                    }                    
                </button>
            </div>
        </div>                    
    );
}