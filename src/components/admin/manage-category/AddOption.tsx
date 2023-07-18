'use client'
import { useState, useEffect, FunctionComponent, MouseEventHandler } from 'react';
import { ListContainer } from './ListContainer';
import { NewOption } from './NewOption';
import { NewSubOption } from './NewSubOption';
import { ButtonWithLoader } from '@/components/Buttons';
import { IOption } from '../../../../types';

interface IAddOption {
    parentCategory: string; 
    onSubmit: (data:IOption)=>void; 
    onCancel: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
    loading: boolean;
}

export const AddOption:FunctionComponent<IAddOption> = ({parentCategory, onSubmit, onCancel, loading}) => {
    const [subCategoryData, setSubCategoryData] = useState<IOption>({category:'', options:[]});
    const [edited, setEdited] = useState<null|{lvl:number, myIdx?:number, oldLabel?:string}>(null);
    const [toBeAdd, setToBeAdd] = useState<string|null>(null);

    const { category, options } = subCategoryData;

    useEffect(()=>{
        setEdited({lvl:0});        
    }, []);    

    const subOptionList = () => {
        return (
            <ListContainer
                title={{
                    title:`List of ${category}`, 
                    textStyle:`text-gray-700 text-base font-semibold`
                }}
                addButton={{
                    title:category, 
                    click:()=>{setToBeAdd("");}, 
                    disabled:(edited!==null || toBeAdd !== null || loading)
                }}
            >
            <>
                {
                    toBeAdd!== null &&
                    <NewSubOption
                        placeholder={`New option for ${category}`}
                        value={toBeAdd}
                        onChange={(e)=>{setToBeAdd(e.target.value)}}
                        okClick={()=>{
                            if(toBeAdd === ""){
                                return;
                            }
                            let newOptions = options?.slice();
                            newOptions?.push({category:toBeAdd});
                            setSubCategoryData({category, options:newOptions});
                            setToBeAdd(null);
                        }}
                        cancelClick={()=>{setToBeAdd(null);}}
                        forNewOption={false}
                        isNew={true}
                    />
                }
                {
                    Array.isArray(options) && options.length > 0 ?
                        options.map((opt, i)=>{
                            const isEdit = edited!==null && edited.lvl === 1 && edited.myIdx === i;
                            return (
                                <NewSubOption 
                                    key={i}
                                    placeholder={`sub option for ${category}`}
                                    value={options[i].category}
                                    onChange={(e)=>{
                                        let newOptions = options?.slice();
                                        if(newOptions){
                                            newOptions[i].category = e.target.value;
                                        }
                                        
                                        setSubCategoryData({category, options:newOptions});
                                    }}
                                    cancelClick={()=>{//this method is to delete a sub option
                                        if(isEdit){
                                            const {oldLabel} = edited;
                                            const updatedOptions = options?.slice();
                                            if(updatedOptions){
                                                updatedOptions[i].category = oldLabel?oldLabel:'';
                                            }                                            
                                            setSubCategoryData({category, options:updatedOptions});
                                            setEdited(null);
                                        }else{
                                            let newOptions = options.filter((o, idx)=>idx !== i);                                                                                
                                            setSubCategoryData({category, options:newOptions});
                                            setEdited(null);
                                        }                                        
                                    }}
                                    forNewOption={true}
                                    isEdit={isEdit}
                                    startEdit={()=>{setEdited({lvl:1, myIdx:i, oldLabel:options[i].category})}}
                                    endEdit={()=>{
                                        if(options[i].category === ""){//must not be empty string....
                                            return;
                                        }
                                        setEdited(null);
                                    }}
                                />                                                                    
                            );
                        }):
                            <p className="text-sm italic">
                                ...no selection....
                            </p>
                }
            </>   
            </ListContainer>
        );
    }

    return (   
            <form 
                className={`bg-white shadow-md rounded-lg px-3 py-1 mb-3`}
                onSubmit={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    onSubmit(subCategoryData)
                }}
                noValidate
            >
                <div className="flex justify-between">
                    <div className='block text-gray-700 text-base font-semibold'>
                        {parentCategory + " > " + (category===''?'New Option':category)}
                    </div>
                </div>
                <div className={`py-2 text-sm`}>
                    <NewOption
                        placeholder=""
                        value={category}
                        onChange={(e)=>{
                            setSubCategoryData({category:e.target.value, options})
                        }}
                        edited={edited!==null?
                            {value:edited.oldLabel?edited.oldLabel:'', lvl:edited.lvl}:
                                /*{value:'', lvl:-1}*/null}
                        startEdit={()=>{setEdited({lvl:0});}}
                        editOk={()=>{                        
                            setEdited(null);
                        }}
                    />
                    {
                        category!=="" && subOptionList()

                    }
                </div> 
                <div className="block bg-gray-200 text-sm flex items-center justify-end py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                    <ButtonWithLoader
                        label='submit'
                        disabled={loading || category==='' || toBeAdd !== null || edited !== null}
                        loading={loading}
                        type='submit'
                    /> 
                    <button 
                        className={`hover:text-gray-600 text-gray-500 font-bold py-2 px-4 ${loading && 'opacity-70'}`}
                        onClick={(e)=>{if(typeof onCancel === 'function'){onCancel(e)}}}
                        disabled={loading}
                    >
                        Cancel
                    </button>                    
                </div>                               
            </form>
        
    );
}