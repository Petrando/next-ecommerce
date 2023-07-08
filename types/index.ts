export interface ISubOption {
    _id?:any;
    category: string;
}

export interface IOption {
    _id?:any;
    category: string;
    options?: ISubOption[];
}

export interface ICategoryData {
    _id?:any;
    category: string;
    options?: IOption[]
}

export interface IProductCategory {    
    categoryId: string;
    option:{
        optionId: string;
        subOption?:{
            subOptionId: string;
        }
    }
}

export interface IMyCategory {   
    _id:any;
    category: string;
    options?:{
        _id:any;
        category: string;
        options?:{
            _id:any;
            category: string;
        }
    }    
}

export interface IProduct {
    _id: string;
    itemName: string;
    itemDescription: string;
    isNewItem: boolean;
    price: number;
    category: IProductCategory;
    stock: number;
    isNew: boolean;
    sold: number;
    productPic: string;
    myCategory: {
        withSubOptions:IMyCategory[];
        withoutSubOptions:IMyCategory[];
    };
    shipping: boolean;
    rating: number;
    review: any[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}