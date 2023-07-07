import { FunctionComponent, useState, useEffect } from 'react';
import Image from 'next/image';

interface IProductPic {
    productPic: string;
}

export const ProductPic:FunctionComponent<IProductPic> = ({productPic}) => {
    const [src, setSrc] = useState<string>('')
    const [loaded, setLoaded] = useState<boolean>(false)

    const getSrc = async (public_id:string) => {
        const response = await fetch('/api/products/get-product-pic', {
            method: 'POST',
            body: JSON.stringify({ public_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
      
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error || 'Something went wrong!');
        }
        
        setSrc(data.url)     
    }

    useEffect(()=>{
        getSrc(productPic)
    }, [])
    return (                                    
        <div className='w-full h-64 relative flex items-center justify-center m-2'>
            {
                !loaded && <p className='font-semibold italic'>Loading</p>
            }
            {
                src!=='' &&                
                    <Image 
                        fill 
                        className={`object-cover ${loaded?'opacity-100':'opacity-0'}`}
                        alt='product image' 
                        src={src} 
                        onLoad={()=>{
                            setLoaded(true)
                        }}
                    />
            }            
        </div>        
    )
}