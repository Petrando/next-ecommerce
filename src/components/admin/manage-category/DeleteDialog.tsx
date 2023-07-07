'use client'
import { FunctionComponent, MouseEventHandler } from 'react';
import { FullscreenBaseModal } from '@/components/Modal';

interface IDeleteDialog {
    title: string; 
    deleteClick: MouseEventHandler<HTMLButtonElement>; 
    close: MouseEventHandler<HTMLButtonElement>;
}

export const DeleteDialog:FunctionComponent<IDeleteDialog> = ({title, deleteClick, close}) => {
    return (
        <FullscreenBaseModal>            
            <div className=" w-full max-w-md bg-white rounded">
                <div className="py-4 px-2 flex justify-center items-center bg-red-100 rounded">
                    <p className="text-lg font-semibold text-rose-800">
                        Delete { title }?
                    </p>
                </div>
                <div className="flex justify-end items-center py-2 mr-2">
                    <button
                        className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
                        onClick={deleteClick}
                    >
                        Delete
                    </button>
                    <button
                        className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ml-1"
                        onClick={close}
                    >
                        Close
                    </button>
                </div>
            </div>            
        </FullscreenBaseModal>
    );
}