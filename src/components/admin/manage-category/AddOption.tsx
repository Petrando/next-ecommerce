'use client'
import { useState, useEffect, FunctionComponent, MouseEventHandler } from 'react';
import { FullscreenModal } from '@/components/Modal';
import { ListContainer } from './ListContainer';
import { NewOption } from './NewOption';
import { NewSubOption } from './NewSubOption';
import { IOption } from '../../../../types';

interface IAddOption {
    dialogTitle: string; 
    onSubmit: (data:IOption)=>void; 
    onCancel: MouseEventHandler<HTMLButtonElement | HTMLDivElement>
}

export const AddOption:FunctionComponent<IAddOption> = ({dialogTitle, onSubmit, onCancel}) => {
    const [subCategoryData, setSubCategoryData] = useState<IOption>({category:'', options:[]});
    const [edited, setEdited] = useState<null|{lvl:number, myIdx?:number, oldLabel?:string}>(null);
    const [toBeAdd, setToBeAdd] = useState<string|null>("");

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
                    disabled:(edited!==null || toBeAdd !== null)
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
        <FullscreenModal
            title={dialogTitle}
            footerEl={null}
            close={onCancel}
            okClick={()=>{onSubmit(subCategoryData);}}
        >
            <ListContainer
                title={{title:category, textStyle:`text-gray-700 text-base font-semibold`}}                
            >
                <>
                    <NewOption
                        placeholder=""
                        value={category}
                        onChange={(e)=>{
                            setSubCategoryData({category:e.target.value, options})
                        }}
                        edited={edited!==null?
                            {value:edited.oldLabel?edited.oldLabel:'', lvl:edited.lvl}:
                                {value:'', lvl:-1}}
                        startEdit={()=>{setEdited({lvl:0});}}
                        editOk={()=>{                        
                            setEdited(null);
                        }}
                    />
                    {
                        category!=="" && subOptionList()

                    }            
                </>
            </ListContainer>
        </FullscreenModal>
    );
}