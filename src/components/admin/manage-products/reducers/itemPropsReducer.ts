import { IProduct } from "../../../../../types";
export enum ItemActionKind {
    SET_NAME = 'SET_NAME',
    SET_CONDITION = 'SET_CONDITION',
    SET_DESCRIPTION = 'SET_DESCRIPTION',
    SET_PRICE = 'SET_PRICE',
    SET_STOCK = 'SET_STOCK',
    SET_PIC = 'SET_PIC',
    SET_NEW_PIC = 'SET_NEW_PIC',
    RESET_ITEM = 'RESET_ITEM',
    INIT_ITEM_FOR_EDIT = 'INIT_ITEM_FOR_EDIT'
}

interface IItemProp {
    itemName: string;
    itemDescription: string;
    price: number;
    stock: number;
    isNewItem: boolean;
    productPic: string;
    newProductPic: File | null;
}

export const initialItem:IItemProp = {
    itemName:'',
    itemDescription:'',
    price: 0,
    stock: 0,
    isNewItem: true,
    productPic: '',
    newProductPic: null
}

export interface IAction {
    type: ItemActionKind;
    payload? : File |  number | string | boolean | IProduct | null;
}

export const itemPropReducer = (state:IItemProp, action:IAction) => {
    const { type, payload } = action

    if(type === ItemActionKind.SET_NAME){
        console.log('payload : ', payload)
        return Object.assign({}, state, {itemName:payload})
    }
    if(type === ItemActionKind.SET_CONDITION){
        return Object.assign({}, state, {isNewItem:payload})
    }
    if(type === ItemActionKind.SET_DESCRIPTION){
        return Object.assign({}, state, {itemDescription:payload})
    }
    if(type === ItemActionKind.SET_PRICE){
        const price = (typeof payload=== 'number' && payload > 0)?payload:0
        return Object.assign({}, state, {price})
    }
    if(type === ItemActionKind.SET_STOCK){
        const stock = (typeof payload=== 'number' && payload > 0)?payload:0
        return Object.assign({}, state, {stock})
    }
    if(type === ItemActionKind.SET_PIC){
        return Object.assign({}, state, {productPic:payload})
    }
    if(type === ItemActionKind.SET_NEW_PIC){
        return Object.assign({}, state, {newProductPic:payload})
    }
    if(type === ItemActionKind.RESET_ITEM){
        return Object.assign({}, state, initialItem)
    }
    if(type === ItemActionKind.INIT_ITEM_FOR_EDIT){
        //return Object.assign({}, state, initialItem)
        //console.log('in item reducer : ', payload, ', ')
        if(typeof payload === 'object' && payload!==null && '_id' in payload){            
            const {itemName, itemDescription, price, stock, isNewItem, productPic} = payload
            return Object.assign({}, state, {itemName, itemDescription, price, stock, isNewItem, productPic})
        }        
        return state
    }
    return state
}