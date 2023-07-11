import { IProductInCart, IProduct } from '../../../types';

export const itemTotal = () => {
	if(typeof window !== 'undefined'){
        const cart = localStorage.getItem('cart')
        if(cart){
            const Cart = JSON.parse(cart)
            return Cart.length;
        }        
		return 0;
	}
}

export const getCart = () => {
	if(typeof window !== 'undefined'){
        const cart = localStorage.getItem('cart')
		if(cart){
			return JSON.parse(cart);
		}
		return [];
	}
}

export const itemInCart = (itemId:string) => {
    if(typeof window !== 'undefined'){
        const cart = localStorage.getItem('cart')
        if(cart){
            return JSON.parse(cart).filter((d:IProductInCart,i:number) => d._id===itemId).length > 0;
        }
        return false;
    }
}

export const updateItem = (productId:string, count:number) => {
    
    if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart');
        if(cart) {
            const Cart = JSON.parse(cart);

            const updatedCart = Cart.map((product:IProductInCart, i:number) => {
                if (product._id === productId) {
                    updatedCart[i].count = count;
                }
            });
    
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }        
    }
};

export const addItem = (item:IProduct, next:any) => {
	if(typeof window !== 'undefined'){
        const cart = localStorage.getItem('cart');
		
        const Cart = cart?JSON.parse(cart):[];
        Cart.push({...item, count:1});

        const uniqueItems = Array.from(new Set(Cart.map((p:IProductInCart) => p._id)))
            .map(id => {
                return Cart.find((p:IProductInCart) => p._id === id);
            })

        localStorage.setItem('cart', JSON.stringify(uniqueItems));
									
		next();
	}
}

export const removeItem = (productId:string, next:any) => {
    
    if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart');
        if (cart) {
            const Cart = JSON.parse(cart);

            const updatedCart = Array.from(new Set(Cart.filter((product:IProductInCart, i:number) => {
                return product._id !== productId;
            })));    
            
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        next();
    }
    //return cart;
};

export const emptyCart = (next:any) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        next();
    }
};