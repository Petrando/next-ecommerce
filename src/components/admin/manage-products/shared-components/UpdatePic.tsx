import { FunctionComponent} from 'react'
import Image from 'next/image';
import { XCircle } from '@/components/Icons';

interface IUpdatePic {
    productPic?: string;
    newProductPic: File|null;
    itemName: string;
    setNewPic: (pic:File)=>void;
    cancelUpdate?: ()=>void;
}

export const isAbsoluteUrl = (urlString:string) => {
    if (urlString.indexOf('http://') === 0 || urlString.indexOf('https://') === 0){
        return true
    }
    return false
}

export const UpdatePic:FunctionComponent<IUpdatePic> = ({productPic, newProductPic, itemName, setNewPic, cancelUpdate}) => {    
    const isTwoPic = newProductPic!==null
    return (
        <div className='flex flex-wrap w-full mt-3 mb-2'>
            <div className={`w-full ${newProductPic===null?'md:w-1/2':'md:w-1/3'} md:pr-3 mb-2 md:mb-0`}>
                <label 
                    htmlFor='dropzone-file' 
                    className='flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100'
                >
                    <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                        <svg aria-hidden='true' className='mb-3 w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path></svg>
                        <p className='mb-2 text-sm text-gray-500 text-center'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                        <p className='text-xs text-gray-500 text-center'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input 
                        id='dropzone-file' 
                        type='file' 
                        className='hidden' 
                        onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>{	
                            const imageFile = evt?.target?.files && evt.target.files[0];                                
                            if(!imageFile){
                                return
                            }
                            //itemDispatch({type:ItemActionKind.SET_NEW_PIC, payload:imageFile})
                            setNewPic(imageFile)
                        }}
                    />
                </label>
            </div>
            <div className={`w-full flex items-center justify-center ${!isTwoPic?'md:w-1/2':'md:w-2/3'} mb-2 md:mb-0 overflow-hidden flex flex-wrap`}>
                <div className={`w-full ${newProductPic===null?'md:w-full':'md:w-1/2'} h-64 relative flex items-center justify-center p-2`}>
                {
                    productPic && ((productPic !== '' && isAbsoluteUrl(productPic))?                            
                        <Image 
                            fill
                            className={`object-cover rounded-lg`}
                            src={productPic} 
                            key={productPic} 
                            alt={itemName}
                        />:
                            <p>Loading...</p>)
                }
                </div>
                {
                    newProductPic!== null &&
                        <div className={`w-full md:w-1/2 h-64 relative flex items-center justify-center p-2`}>
                            <Image
                                fill 
                                className={`rounded-lg object-cover`}
                                src={URL.createObjectURL(newProductPic)} 
                                alt={`new ${itemName} pic`}
                            />
                            <div 
                                className='flex items-center justify-center cursor-pointer absolute right-0 top-0'
                                onClick={()=>{
                                    //itemDispatch({type:ItemActionKind.SET_NEW_PIC, payload:null})
                                    if(cancelUpdate){ cancelUpdate() }
                                    
                                }}
                            >
                                <XCircle />
                            </div>
                        </div>
                        
                }                       
            </div>
        </div>
    )
}