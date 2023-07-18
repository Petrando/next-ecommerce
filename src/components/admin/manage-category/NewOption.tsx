'use client'
import { FunctionComponent, ChangeEventHandler, MouseEventHandler, MouseEvent } from 'react';
import { Input } from '@/components/Inputs';
import { Check, Edit, XMark, Trash, ChevDown, ChevUp } from '@/components/Icons';
import { ListDot } from '@/components/ListDot';

interface iEdited {
    value: string;
    lvl?: number;
}

interface INewOption {
    placeholder: string; 
    value: string; 
    onChange: ChangeEventHandler<HTMLInputElement>; 
    edited: iEdited | null; 
    startEdit: ()=>void;
    editOk: ()=>void;
}

export const NewOption:FunctionComponent<INewOption> = ({placeholder, value, onChange, edited, startEdit, editOk}) => {
    /*
        This NewOption component will only be called from 2 parent component : AddCategory and AddOption
        if called from AddOption, the 'edited' prop will have 'lvl' property
        if called from AddCategory, the 'edited' prop will only have 'value', no 'lvl' property
    */
   //Note to self : the above note maybe wrong...:D
    const isEdit = (edited && (edited.lvl === 0 /*called by AddOption*/ 
        || 'value' in edited/*called by AddCategory*/))?true:false;

    const hoverStyle = value === ""?"":"hover:bg-emerald-700";
    const focusStyle = value === ""?"":"focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50";
    
    return (        
        <div className={"flex justify-start rounded-md px-2 py-2 my-2"}>
            <ListDot />
            {
                edited?
                <Input
                    height="h-8"
                    placeholder={placeholder}
                    value={value}                
                    onChange={onChange}
                    disabled={!isEdit}
                />:
                <div className={`flex-grow font-medium px-2`}>
                    {value}
                </div>
            }            
            <div className="flex justify-end text-sm font-normal text-gray-500 tracking-wide">
                <button 
                    type="button" 
                    className={`bg-${value===""?"neutral":"emerald"}-500 ${hoverStyle} text-white font-bold ${focusStyle} px-1 py-1 text-center inline-flex items-center rounded`}
                    disabled={value===""}
                >
                    {
                        isEdit?<Check onClick={editOk} />:<Edit onClick={startEdit}/>
                    }                            
                </button>                
            </div>
        </div>                    
    );
}

interface INewOptionItem {
    placeholder: string; 
    value: string; 
    onChange: ChangeEventHandler<HTMLInputElement>|(()=>void); 
    chevClick: ()=>void;//MouseEventHandler<SVGElement>|((e:MouseEvent<SVGElement>)=>void); 
    selected: boolean; 
    edited: boolean; 
    startEdit: ()=>void; 
    editOk: ()=>void; 
    cancelClick: MouseEventHandler<HTMLButtonElement>|(()=>void)
}

/*
    NewOptionItem is for listing new options in add new category UI
*/
export const NewOptionItem:FunctionComponent<INewOptionItem> = ({placeholder, value, onChange, chevClick, selected, edited, startEdit, editOk, cancelClick}) => {

    const hoverStyle = value === ""?"":"hover:bg-emerald-700";
    const focusStyle = value === ""?"":"focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50";

    return (
        <div className={"flex justify-start rounded-md px-2 py-2 my-2"}>
            <ListDot />
            {
                edited?
                    <Input
                        height="h-8"
                        placeholder={placeholder}
                        value={value}                
                        onChange={onChange}
                        disabled={!edited}
                    />:
                        <div className={`flex-grow font-medium px-2`}>
                            {value}
                        </div>
            }
            <div className="flex justify-end text-sm font-normal text-gray-500 tracking-wide">
                <button 
                    type="button" 
                    className={`bg-${value===""?"neutral":"emerald"}-500 ${hoverStyle} text-white font-bold ${focusStyle} px-1 py-1 text-center inline-flex items-center rounded`}
                    disabled={value===""}
                >
                {
                    edited?<Check onClick={editOk} />:<Edit onClick={startEdit} />
                }
                </button>
                <button 
                    type="button" 
                    className={`bg-pink-500 hover:bg-pink-700 text-white font-bold focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 px-1 py-1 text-center inline-flex items-center rounded`}
                    onClick={cancelClick}
                >
                { edited?<XMark />:<Trash />}    
                </button>
                { selected?<ChevUp onClick={chevClick} />:<ChevDown onClick={chevClick} />}
            </div>
        </div>
    );
}