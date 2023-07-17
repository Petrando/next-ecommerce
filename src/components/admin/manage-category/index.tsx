'use client'
import { FunctionComponent, useState, useEffect, Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
//import { isAuthenticated } from "../../../api/api-auth";
//import { getCategories, createCategory, addOption, addSubOption, updateCategoryTitle, deleteCategory} from "../../../api/api-admin.js";
import { PageContainer } from '@/components/PageContainer';
import { Edit, Trash, Check, Reload, Cancel, ChevDown, ChevUp } from '@/components/Icons';
import { Input } from '@/components/Inputs';
import { AddCategory } from './AddCategory';
import { ICategoryData, IOption } from '../../../../types';
import { AddOption } from './AddOption';
import { NewSubOption } from './NewSubOption';
import { ListContainer } from './ListContainer';
import { ListDot } from '@/components/ListDot';
import { DeleteDialog } from './DeleteDialog';

export const CategoryList:FunctionComponent = () => {
    const [categories, setCategories] = useState<ICategoryData[]>([]);
	const [selected, setSelected] = useState<null|{lvl0: Number, lvl1?: number}>(null);
	const [edited, setEdited] = useState<null|{_id:any, defaultValue?: string, editedValue: string, myIdx:number, parent0?: number, parent1?: number}>(null);
    const [toDelete, setToDelete] = useState<null|{_id:any, parentIdxs:number|number[]}>(null);
	const [toBeAdded, setToBeAdded] = useState<null | {addValue: string, myIdx?: number, parentIdx?: number}>(null);

    /*
	const {user, token} = isAuthenticated();	
	*/
	const loadCategories = async() => {
		const response = await fetch('/api/categories/list-categories/'/*,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }*/);
        const categories = await response.json()
        if(categories.data){
            setCategories(categories.data)
        }
        
	}

	useEffect(() => {
		loadCategories()
	}, []);	

    const categoryList = () => {        
        return (
            <PageContainer>
                <ListContainer
                    title={{title:"Category List", textStyle:"text-gray-700 text-2xl font-semibold"}}
                    addButton={{
                        title:"Category", 
                            click:()=>{setToBeAdded({addValue:''});setSelected(null);}
                    }}
                    withSearch={true}
                >
                    {
                        categories.length > 0 && categories.map((d, i)=>{
                            return (
                                <Fragment key={i}>{aCategory(d, i)}</Fragment>
                            );
                        })
                    }
                </ListContainer>
            </PageContainer>
        );
    }

    const iAmSelected = (i: number, lvl: number) => {
		if(selected === null || lvl===2){
			return false;
		}
		else if(lvl === 0){
			return selected.lvl0 === i;
		}else {
			return selected.lvl1 === i;
		}
	}

    const iAmEdited = (i: number, lvl: number, parentIdxs: number | number[]) => {
		if(edited === null) {
			return false;			
		}else if(lvl === 0){
			return typeof edited.parent0 === 'undefined' && typeof edited.parent1 === 'undefined' && edited.myIdx === i;
		}else if(lvl === 1){
            if(Array.isArray(parentIdxs)){
                return edited.parent0 === parentIdxs[0] && typeof edited.parent1 === 'undefined' &&edited.myIdx === i;
            }			
		}else if(lvl === 2){
            if(Array.isArray(parentIdxs)){
                return edited.parent0 === parentIdxs[0] && edited.parent1 === parentIdxs[1] && edited.myIdx === i;
            }			
		}
	}

	const iAmAdding = (i: number, lvl: number, parentIdx = -1) => {
		if(toBeAdded === null || typeof toBeAdded.myIdx === 'undefined'){
			return false;
		}else if(lvl === 0){            
			return toBeAdded.myIdx === i && toBeAdded.parentIdx === -1;//typeof toBeAdded.parentIdx === 'undefined';
		}else if(lvl === 1){
			return toBeAdded.myIdx === i && parentIdx === toBeAdded.parentIdx;
		}
	}

    const renderMyOptions = (theOptions: IOption[], lvl: number, optionParentIdxs: number[], title: string) => {
        const optionLvl = lvl===0?1:2;        
		const myIdx = optionParentIdxs[optionParentIdxs.length - 1];
		const parentIdx = optionParentIdxs[0];
		const iAdding = iAmAdding(myIdx, lvl, parentIdx);  
        return (                                
            <ListContainer
                title={{title:`List of ${title}`, textStyle:`text-gray-700 text-${optionLvl === 1?"base":"sm"} font-semibold`}}
                addButton={{
                    title, 
                    click:() => {													
                        let newToBeAdded = {addValue:'', myIdx, parentIdx: -1};
                        if(lvl === 1)//...means add a subSubCategory.... 
                        {
                            newToBeAdded.parentIdx = parentIdx;
                        }
                        setToBeAdded(newToBeAdded);
                    },
                    disabled:iAdding
                }}
                additionals={
                    iAdding && toBeAdded &&
                    (
                        //typeof toBeAdded.parentIdx !== 'undefined'?
                        toBeAdded.parentIdx !== -1?
                        <NewSubOption
                            value={toBeAdded.addValue}
    			            onChange={(e) => setToBeAdded({...toBeAdded, addValue:e.target.value})}
                            placeholder={`new ${title}`}
                            okClick={async()=>{
                                if(toBeAdded){
                                    const {parentIdx, myIdx, addValue} = toBeAdded;
                                    if( typeof parentIdx === 'number' && typeof myIdx === 'number'){
                                        //console.log(categories[parentIdx])
                                        //console.log('myIdx : ', myIdx)
                                        const selectedCategory = categories[parentIdx]
                                        const {_id} = selectedCategory
                                        const optionId = selectedCategory.options?selectedCategory.options[myIdx]._id:''

                                        if(optionId!==''){//this checking maybe uneccessary
                                            try{
                                                const response = await fetch('/api/admin/manage-categories/add-sub-option/',
                                                {
                                                    method: 'POST',
                                                    body: JSON.stringify({_id, optionId, newSubOption:addValue}),
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                });
                                                const addSubOptionResult = await response.json()
                                                console.log('add sub option result : ', addSubOptionResult)
                                                loadCategories()
                                            }
                                            catch(err){
                                                console.log('error : ', err)
                                            }
                                            finally{
                                                setToBeAdded(null);
                                            }
                                            
                                        }
                                        
                                    }
                                    
                                }
                                
                            }}
                            cancelClick={()=>{setToBeAdded(null);}}
                            forNewOption={false}
                        />
                        :
                        <AddOption
                            dialogTitle={`New Option for ${title}`}
                            onSubmit={async(newOption)=>{	                              
                                if(typeof toBeAdded.myIdx === 'number'){
                                    const {_id} = categories[toBeAdded.myIdx];
                                    const response = await fetch('/api/admin/manage-categories/add-option/',
                                    {
                                        method: 'POST',
                                        body: JSON.stringify({_id, newOption}),
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const addOptionResult = await response.json()

                                    await loadCategories()
                                    setToBeAdded(null)
                                }
                            }}
                            onCancel={()=>{setToBeAdded(null);}}
                        />
                    )
                }
            >
                {
                    typeof theOptions!=='undefined' && theOptions.length > 0 &&				
                    <>
                    {
                        theOptions.map((cat,i) => 
                            <Fragment key={i}>
                                {aCategory(cat,i,optionLvl, optionParentIdxs)}
                            </Fragment>)}
                    </>                    
                    
                }
                {
                    (typeof theOptions === 'undefined' || theOptions.length === 0) && !iAdding &&
                    <p className="text-sm italic">
                        ...no selection....
                    </p>
                }
            </ListContainer>
        );
    }

    const aCategory = (c:any, idx:number, lvl:number = 0, parentIdxs:number|number[]=-1) => {                
        const iEdited = iAmEdited(idx, lvl, parentIdxs);
		const iSelected = iAmSelected(idx,lvl);
		const displayValue = typeof c==='object'?c.category:c

		const optionParentIdxs = lvl === 0?[idx]:[Array.isArray(parentIdxs)?parentIdxs[0]:parentIdxs, idx];
		const myOptions = iSelected && renderMyOptions(c.options, lvl, optionParentIdxs, c.category);
		
		const parentIdx = optionParentIdxs[0]
		const iAdding = iAmAdding(idx, lvl, parentIdx);

        //const myEdited = edited!==null && iEdited?<></>:null;
        //console.log(c, lvl, parentIdxs);

        const chevButton = 
        <>
        {
            iSelected?
            <ChevUp
                onClick={()=>{
                    console.log('ChevUp clicked, ', toBeAdded)
                    if(toBeAdded!==null || edited !== null || lvl > 1){
                        //setToBeAdded(null);//TESTING ONLY!!REMEMBER TO REMOVE!!
                        return;
                    }
                    if(lvl === 0){						
                        setSelected(null)
                    }else {
                        if(selected){
                            setSelected({lvl0:selected.lvl0})
                        }                        
                    }    
                }}
            />:
            <ChevDown
                onClick={()=>{
                    console.log('ChevDown clicked ', toBeAdded)
                    if(toBeAdded!==null || edited !== null || lvl > 1){
                        //setToBeAdded(null);//TESTING ONLY!!REMEMBER TO REMOVE!!
                        return;
                    }
                    if(lvl === 0){						
                        setSelected({lvl0:idx})
                    }else {
                        if(selected){
                            setSelected({lvl0:selected.lvl0, lvl1:idx})
                        }                        
                    }
                }}
            />
        }
        </> 

        return (
            <>
            <div                 
                className={
                    "flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 " +
                        "rounded-md px-2 py-2 my-2"}
            >
                <ListDot />
                {
                    iEdited?(
                        edited &&
                        <Input
                            height="h-6"
                            value={edited.editedValue}
                            onChange={(e) => setEdited({...edited, editedValue:e.target.value})}
                        />
                    ):
                    <div className={`flex-grow 
                        font-${iSelected?"bold":"medium"} ${iSelected&&'text-base'} px-2`}>
                    { c.category }
                    </div>
                }                
                <div className="flex justify-end text-sm font-normal text-gray-500 tracking-wide">
                    {
                        iEdited?
                        <>
                            <Check onClick={async()=>{
                                console.log('update title')
                                if(edited){
                                    const {myIdx, editedValue, parent0, parent1, _id} = edited; 
                                    //parent0 refers to a Category!!
                                    //parent1 refers to an option of a Category!!   
                                    let categoryId = '', optionIdx:string|number = '', 
                                        subOptionIdx:string|number = '', 
                                            optionId:string = '', subOptionId:string = '';

                                    if(typeof parent0==='undefined' && typeof parent1 === 'undefined'){
                                        categoryId = categories[myIdx]._id;
                                        optionIdx = -1;
                                        subOptionIdx = -1;
                                    }
                                    else if(typeof parent0 !== 'undefined'){
                                        const selectedCategory = categories[parent0]
                                        categoryId = selectedCategory._id;
        
                                        if(typeof parent1 === 'undefined'){
                                            optionIdx = myIdx;

                                            optionId = selectedCategory.options?
                                                selectedCategory.options[optionIdx]._id:''
                                            subOptionIdx = -1;
                                            //const subOptions = selectedCategory.options?
                                                //selectedCategory.options[optionIdx].options:[]
                                        }else{
                                            optionIdx = parent1;
                                            const selectedOption = selectedCategory.options?
                                                selectedCategory.options[optionIdx]:null
                                            optionId = selectedOption!==null?selectedOption._id:''
                                            subOptionIdx = myIdx
                                            if(selectedOption!==null){
                                                subOptionId = selectedOption.options?
                                                    selectedOption.options[subOptionIdx]._id:''
                                            }
                                            
                                            
                                        }
                                    }
                                    
                                    try {
                                        const response = await fetch(
                                            '/api/admin/manage-categories/update-title/',
                                            {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    categoryId, optionIdx, optionId, subOptionId, subOptionIdx,
                                                        value:editedValue}),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            }
                                        );
                                        const updateTitleResult = await response.json()
                                        console.log(updateTitleResult)

                                        
                                    } 
                                    catch(err){
                                        console.log(err)
                                    }
                                    finally{
                                        setEdited(null)
                                        loadCategories()
                                    }
                                }    												                                                            
                            }} />
                            <Reload onClick={()=>{}} />
                            <Cancel onClick={()=>{setEdited(null);}} />
                        </>:
                        <>
                            <Edit 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();		
                                    console.log('c._id :', c._id)				 		
                                    if(edited!==null){
                                        return;						 			
                                    }else {
                                        switch (lvl){
                                            case 0:
                                                setEdited({
                                                    myIdx:idx, 
                                                        defaultValue:displayValue, 
                                                            editedValue:displayValue,
                                                                _id:c._id
                                                });
                                                break;
                                            case 1:
                                                if(Array.isArray(parentIdxs)){
                                                    setEdited({
                                                        myIdx:idx, 
                                                            parent0:parentIdxs[0], 
                                                                defaultValue:displayValue, 
                                                                    editedValue:displayValue,
                                                                        _id:c._id
                                                    });
                                                }                                                
                                                break;
                                            case 2:
                                                if(Array.isArray(parentIdxs)){
                                                    setEdited({
                                                        myIdx:idx, 
                                                            parent0:parentIdxs[0], 
                                                                parent1:parentIdxs[1], 
                                                                    defaultValue:displayValue, 
                                                                        editedValue:displayValue,
                                                                            _id:c._id
                                                    });
                                                }                                                
                                                break;
                                            default:
                                                break;						 					
                                        }
                                    }
                                }}
                            />
                            <Trash 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();						 		
                                    if(toDelete!==null){
                                        return;						 			
                                    }else {
                                        setToDelete({_id:c._id, parentIdxs});                                        
                                    }
                                }}
                            />
                        </>
                        
                    }
                    {lvl < 2 && chevButton}                   
                </div>                
            </div>
            { myOptions }
            </>
        )
    }
    
    const deleteDialogProps = () => {
        if(toDelete === null){
            return {ids:{categoryId:"", optionId:"", subOptionId:""}, 
                idxs:{ optionIdx:-1, subOptionIdx:-1}, 
                    dialogTitle:""};
        }        

        const { _id, parentIdxs } = toDelete;
        const categoryId = Array.isArray(parentIdxs)?categories[parentIdxs[0]]._id:_id;
        let optionId:string = "";        
        if(parentIdxs === -1){
            optionId = "0";
        }
        if(Array.isArray(parentIdxs)){
            if(parentIdxs.length === 1){
                optionId = _id
            }
            else if(parentIdxs.length === 2){
                const catIdx:number = parentIdxs[0]
                const optIdx:number = parentIdxs[1]
                if(Array.isArray(categories) && categories.length > catIdx){
                    const selectedOptions = categories[catIdx].options
                    if(Array.isArray(selectedOptions) && selectedOptions.length > optIdx){
                        optionId = selectedOptions[optIdx]._id
                    }                    
                }                
            }
        }
        const subOptionId = !Array.isArray(parentIdxs)?"0":
            parentIdxs.length === 1?"0":_id;
            
        const categoryIdx = categories.findIndex(d => d._id === categoryId);
        const category = categories[categoryIdx];
        const option = Array.isArray(category.options)?category.options.find(d => d._id === optionId):null;        
        const subOption = (option && Array.isArray(option.options))?option.options.find(d => d._id=== subOptionId):null;        
        const dialogTitle = category.category + (option?` > ${option.category}`:"") + 
            (subOption?` > ${subOption.category}`:"");

        return { ids:{categoryId, optionId, subOptionId}, 
                dialogTitle};
    }

    const { ids, dialogTitle} = deleteDialogProps();
    
    const addingNewCategory = toBeAdded!==null && !toBeAdded.hasOwnProperty('myIdx');
    
    return (
        <>
        <ToastContainer />
        {categoryList()}     
        {
            addingNewCategory &&
                <AddCategory
                    dialogTitle="New Category"
                    onSubmit={async (newCategoryData)=>{
                        
                        const response = await fetch('/api/admin/manage-categories/add-category/',
                        {
                            method: 'POST',
                            body: JSON.stringify({...newCategoryData}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        const newCategory = await response.json()
                        
                        setToBeAdded(null);
                        loadCategories()
                    }}
                    onCancel={()=>{setToBeAdded(null);}}
                />
        }   
        {
            //work this LAST!
            toDelete !== null&&
                <DeleteDialog
                    title={dialogTitle}                    
                    close={()=>{setToDelete(null);}}
                    ids={ids}
                    onSuccess={()=>{loadCategories();setToDelete(null);}}
                />
        }
        </>
    )
}
