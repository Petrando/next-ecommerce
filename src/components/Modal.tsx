'use client'
import { FunctionComponent, ReactNode, MouseEvent, MouseEventHandler } from "react";

interface IFullscreenModal {
    title: string; 
    footerEl: ReactNode; 
    okClick: ()=> void; 
    close: MouseEventHandler<HTMLDivElement | HTMLButtonElement>; 
    children: ReactNode;
}

export const FullscreenModal:FunctionComponent<IFullscreenModal> = ({title, footerEl, okClick, close, children}) => {
    
    return (
        <div className="modal fixed w-full h-full top-0 left-0 bg-white flex  items-start justify-center">
            {/*<div className="modal-overlay absolute w-full h-full bg-white opacity-95"></div>*/}

            <div className="modal-container fixed w-full h-fit z-50 overflow-y-auto ">
                
                <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm z-50"
                    onClick={(e)=>{
                        e.stopPropagation();
                        close(e);
                    }}
                >
                    <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                    </svg>
                    (Esc)
                </div>

                {/*<!-- Add margin if you want to see grey behind the modal-->*/}
                <div className="modal-content container mx-auto h-auto text-left p-4">
                
                {/*<!--Title-->*/}
                <div className="flex justify-between items-center pb-2">
                    <p className="text-2xl font-bold">
                        {title?title:"Full Screen Modal!"}
                    </p>
                </div>

                {/*<!--Body-->*/}
                {/*<p>Modal content can go here</p>*/}
                { children }                
                {/*<!--Footer-->*/}
                <div className="flex justify-end pt-2">
                    {
                        footerEl?footerEl:
                            <>
                                <button 
                                    className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
                                    onClick={okClick}
                                >
                                    Ok
                                </button>
                                <button 
                                    className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        close(e);
                                    }}
                                >
                                        Close
                                </button>
                            </>
                    }
                    
                </div>

                </div>
            </div>
        </div>
    );
}

interface IModalProps {
    children: ReactNode;
}
export const FullscreenBaseModal:FunctionComponent<IModalProps> = ({ children}) => {
    
    return (
        <div className="modal fixed w-full h-full top-0 left-0 bg-zinc-900 bg-opacity-80 flex items-center justify-center">        
            { children } 
        </div>        
    );
}