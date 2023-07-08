import category from '../../../../../models/category';
import { ICategoryData, IProductCategory } from '../../../../../types';

export enum CategoryActionKind {
    SET_MAIN_CATEGORIES = 'SET_MAIN_CATEGORIES',
    SET_CATEGORY_IDX = 'SET_CATEGORY_IDX',
    SET_OPTION_IDX = 'SET_OPTION_IDX',
    SET_SUBOPTION_IDX = 'SET_SUBOPTION_IDX',
    INIT_FOR_EDIT = 'INIT_FOR_EDIT'
}

export interface IState {
    mainCategories: ICategoryData[];
    categoryIdx:number;
    optionIdx:number;
    subOptionIdx:number
}

export const categoryState:IState = {
    mainCategories: [],
    categoryIdx: 0,
    optionIdx: 0,
    subOptionIdx: 0,
}

export interface IAction {
    type: CategoryActionKind;
    payload : ICategoryData[]|  number | string | IProductCategory;
}

export const categoryReducer = (state:IState, action:IAction):IState => {
    const {type, payload} = action
    if(type === CategoryActionKind.SET_MAIN_CATEGORIES){
        return Object.assign({}, state, {
            mainCategories:payload,
            categoryIdx: 0,
            optionIdx: 0,
            subOptionIdx: 0
        })
    }
    if(type === CategoryActionKind.SET_CATEGORY_IDX){
        if(typeof payload === 'number'){            
            return Object.assign({}, state, {categoryIdx:payload, optionIdx:0, subOptionIdx:0})
        }        
    }

    if(type === CategoryActionKind.SET_OPTION_IDX){
        if(typeof payload === 'number'){            
            return Object.assign({}, state, {optionIdx:payload, subOptionIdx:0})
        }        
    }

    if(type === CategoryActionKind.SET_SUBOPTION_IDX){
        if(typeof payload === 'number'){            
            return Object.assign({}, state, {subOptionIdx:payload})
            
        }        
    }

    if(type === CategoryActionKind.INIT_FOR_EDIT){
        console.log('INIT_FOR_EDIT, ', payload)
        if(typeof payload ==='object' && 'categoryId' in payload){
            const {mainCategories} = state
            const { categoryId, option:{optionId}} = payload
            const categoryIdx = mainCategories.findIndex(d => d._id === categoryId)
            const options = mainCategories[categoryIdx].options
            const optionIdx = options?.findIndex(d => d._id === optionId)
            const option = (options && optionIdx)?options[optionIdx]:null
            const subOptionIdx = ('subOption' in payload.option && option && 'options' in option)?
                option.options?.findIndex(d => d._id === payload.option.subOption?.subOptionId):0
            

            return Object.assign({}, state, {
                categoryIdx,
                optionIdx,
                subOptionIdx
            })
        }
        return state
    }

    return state;
}

export const getCategoryStructures = (state:IState) => {
    const { mainCategories, categoryIdx, optionIdx, subOptionIdx } = state;
    const categories = mainCategories.length > 0?mainCategories.map((d:ICategoryData)=>{
        return {category:d.category, _id:d._id}
    }):[]
    const category = mainCategories.length > 0?mainCategories[categoryIdx]:null
    const options = (category!==null && category.options !== undefined)?category.options:[]
    const option = options.length>0?options[optionIdx]:null;
    const subOptions = (option!==null && option.options!== undefined)?option.options:[]

    return {categories, options, subOptions}
}

export const getCategoryIds = (state:IState) => {
    const { mainCategories, categoryIdx, optionIdx, subOptionIdx } = state;
    const categories = mainCategories.length > 0?mainCategories.map((d:ICategoryData)=>{
        return {category:d.category, _id:d._id}
    }):[]
    const category = mainCategories.length > 0?mainCategories[categoryIdx]:null
    const categoryId = category!==null?category._id:''
    const options = (category!==null && category.options !== undefined)?category.options:[]
    const option = options.length>0?options[optionIdx]:null;
    const optionId = option!==null?option._id:''
    const subOptions = (option!==null && option.options!== undefined)?option.options:[]
    const subOption = subOptions.length > 0?subOptions[subOptionIdx]:null
    const subOptionId = subOption!==null?subOption._id:''

    let categoryObj:{
        categoryId:string, 
        option?:{
            optionId:string,
            subOption?:{
                subOptionId:string
            }
        }
    } = {
        categoryId
    }
    if(optionId!==''){
        if(categoryObj){
            categoryObj.option={optionId}
            if(subOptionId!==''){
                categoryObj.option.subOption = {subOptionId}
            }
        }
        
    }

    return categoryObj
}
