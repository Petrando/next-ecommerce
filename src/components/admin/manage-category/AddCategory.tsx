'use client'
import { FunctionComponent, MouseEventHandler, ReactNode } from 'react'
import { useState, useEffect, Fragment } from 'react';
import { FullscreenModal } from '@/components/Modal';
import { ListContainer } from "./ListContainer";
import { NewOption as NewCategory, NewOptionItem} from "./NewOption";
import { NewSubOption as NewOption, NewSubOption } from "./NewSubOption";//can I use this, or make a new component? } from "react";
import { ICategoryData, IOption, ISubOption } from '../../../../types';

interface IAddCategory {
    dialogTitle: string; 
    onSubmit: (param:any)=>void;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    loading: boolean;
}

export const AddCategory:FunctionComponent<IAddCategory> = ({dialogTitle, onSubmit, onCancel, loading}) => {
    const [categoryData, setCategoryData] = useState<ICategoryData>({category:'', options:[]});
	const [selectedOption, setSelectedOption] = useState(null);
	const [selected, setSelected] = useState<Number>(-1);
    /*
        edited is an object.
        edited always has 'value' property.
        if edited has 'optionIdx' property meaning an option is being edited.
        if edited has 'optionIdx' and'subOptionIdx' property meaning a sub option is being edited.
        if edited does not have 'subOptionIdx' nor 'optionIdx' property, the category name is being edited
    */
	const [edited, setEdited] = useState<null | {value:string, optionIdx?: number, subOptionIdx?: number}>(null);	
    /*
        added is an object.
        added always has 'value' property.
        if added has 'parentIdx' property meaning a sub option is being added - 'parentIdx' contains index 
            of the parent.
        if added does not have 'parentIdx' property, a new option for this new category is being added
    */
	const [added, setAdded] = useState<null | {value:string, parentIdx?:number}>(null);
    //const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setEdited({value:''});
    }, []);
    
    const { category, options } = categoryData;

    const subOptionList = (subOptions: ISubOption[], parentIdx: number, parent: string) => {
        return (
            <>
            {
                subOptions.map((sub:ISubOption, i:number)=>{
                    const subOptionIsEdited = edited !== null && edited.optionIdx === parentIdx && edited.subOptionIdx === i;

                    return (
                        <NewSubOption 
                            key={i}
                            placeholder={`sub option for ${parent}`}
                            value={subOptionIsEdited?edited.value:sub.category}
                            onChange={(e)=>{
                                setEdited({...edited, value:e.target.value})
                            }}
                            cancelClick={()=>{//this method is to delete a sub option
                                if(subOptionIsEdited){                                            
                                    setEdited(null);
                                }else{
                                    let newOptions = options?.slice();
                                    const newSubOptions = newOptions &&
                                        newOptions[parentIdx].options?.filter((s, idx)=>idx !== i);                                                                                
                                    if(newOptions){
                                        newOptions[parentIdx].options = newSubOptions;
                                    }
                                    setCategoryData({category, options:newOptions});
                                    setEdited(null);
                                }                                        
                            }}
                            forNewOption={true}
                            isEdit={subOptionIsEdited}
                            startEdit={()=>{
                                setEdited({value:sub.category, optionIdx:parentIdx, subOptionIdx:i})}
                            }
                            endEdit={()=>{setEdited(null);}}
                        />
                    )
                })
            }
            </>
        );
    }

    const optionList = () => {
        return (
            <>
            {
                options && options.map((opt:IOption, i:number)=>{
                    const optionIsEdited = edited !== null && edited.optionIdx === i && !edited.hasOwnProperty('subOptionIdx');
                    const optionIsSelected = selected === i;
                    const newSubOptionIncoming = added !== null && added.hasOwnProperty('parentIdx') && added.parentIdx === i;

                    return (
                        <Fragment key={i}>
                            <NewOptionItem 
                                placeholder={`new option for ${category}`}
                                value={optionIsEdited?edited.value:opt.category}
                                onChange={(e)=>{setEdited({...edited, value:e.target.value})}}
                                chevClick={()=>{setSelected(optionIsSelected?-1:i);}}
                                selected={optionIsSelected}
                                edited={optionIsEdited}
                                startEdit={()=>{setEdited({value:opt.category, optionIdx:i})}}
                                editOk={()=>{
                                    let updatedOptions = options.slice();
                                    updatedOptions[i].category = edited?edited.value:'';
                                    setCategoryData({category, options:updatedOptions});
                                    setEdited(null);
                                }}
                                cancelClick={()=>{
                                    if(optionIsEdited){
                                        setEdited(null);
                                    }else {//option is not being edited, means this is a deleting action
                                        let updatedOptions = options.filter((o, idx)=>idx !== i);
                                        setCategoryData({category, options:updatedOptions})
                                    }
                                }}
                            />
                            {
                                optionIsSelected &&
                                <ListContainer
                                    title={{title:`List of ${opt.category}`, textStyle:`text-gray-700 text-base font-semibold`}}
                                    addButton={{
                                        title:opt.category,
                                        click:()=>{setAdded({value:"", parentIdx:i});},
                                        loading:loading,
                                        disabled:loading
                                    }}
                                >
                                    <>
                                    {
                                        newSubOptionIncoming &&
                                        <NewSubOption
                                            placeholder={`new sub option for ${opt.category}`}
                                            value={added.value}
                                            onChange={(e)=>{setAdded({...added, value:e.target.value});}}
                                            okClick={()=>{
                                                let updatedOptions = options?.slice();                                                
                                                if(updatedOptions){
                                                    updatedOptions[i].options?.push({category:added.value})
                                                }
                                                
                                                setCategoryData({category, options:updatedOptions});
                                                setAdded(null);
                                            }}
                                            cancelClick={()=>{setAdded(null);}}
                                            forNewOption={false}
                                        />
                                    }
                                    {
                                        Array.isArray(opt?.options) && opt?.options?.length > 0 ? 
                                            subOptionList(opt.options, i, opt.category):
                                                <p className="text-sm italic">
                                                    still empty, please add new sub option(s)
                                                </p>
                                    }
                                    </>
                                </ListContainer>
                            }
                        </Fragment>
                    );
                })
            }
            </>
        );
    }

    const categoryEdited = edited && !edited.hasOwnProperty('optionIdx') && !edited.hasOwnProperty('subOptionIdx');
    const isAddingOption = added && !added.hasOwnProperty('parentIdx');    

    const disableControls = loading || categoryData.category === '' || 
        (Array.isArray(categoryData.options) && categoryData.options.length < 1) ||
            edited !== null || added !== null
    return (
        <FullscreenModal
            title={`${dialogTitle} ${category !==""?(" : " && category):""}`}
            footerEl={null}
            close={onCancel}
            okClick={()=>{onSubmit(categoryData);}}
            submitBtnState={{
                loading:loading,
                disabled:disableControls
            }}
        >
            <NewCategory 
                placeholder=""
                value={categoryEdited?edited.value:category}
                onChange={(e)=>{
                    setEdited({value:e.target.value})
                }}                                
                edited={edited/*!==null?edited:{value:'', optionIdx:-1, subOptionIdx: -1}*/}
                startEdit={()=>{setEdited({value:category});}}
                editOk={()=>{                                            
                    setCategoryData({category:edited?edited.value:'', options});
                    setEdited(null);
                }}
            />
            {
                category!=="" &&
                <ListContainer
                    title={{title:`List of ${category}`, textStyle:`text-gray-700 text-lg font-semibold`}}
                    addButton={category === ""?null:
                        {
                            title:category,
                            click:()=>{setAdded({value:""});},
                            loading:loading,
                            disabled:loading
                        }
                    }
                >
                    {
                        isAddingOption &&
                        <NewOption
                            placeholder={`New option for ${category}`}
                            value={added.value}
                            onChange={(e)=>{setAdded({value:e.target.value})}}
                            okClick={()=>{
                                if(added.value === ""){
                                    return;
                                }
                                let newOptions = options?.slice();                                
                                newOptions?.push({category:added.value, options:[]});
                                setCategoryData({category, options:newOptions});
                                setAdded(null);
                            }}
                            cancelClick={()=>{setAdded(null);}}
                            forNewOption={false}
                            isNew={true}
                        />
                    }
                    {
                        Array.isArray(options) && options.length > 0?optionList():
                            <p className="text-sm italic">
                                still empty - must have at least one option. Please add new option(s)
                            </p>
                    }
                </ListContainer>
            }            
        </FullscreenModal>
    );
}