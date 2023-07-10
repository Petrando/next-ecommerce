import { FunctionComponent, useState, useEffect } from 'react';
import { getImgSrc } from '@/utils/api-access';
import Image from 'next/image';

interface IProductPic {
    productPic: string;
}

export const ProductPic:FunctionComponent<IProductPic> = ({productPic}) => {
    const [src, setSrc] = useState<string>('')
    const [loaded, setLoaded] = useState<boolean>(false)
    
    const setImgSrc = async () => {
        const src = await getImgSrc(productPic)
        setSrc(src)
    }

    useEffect(()=>{
        setImgSrc()
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