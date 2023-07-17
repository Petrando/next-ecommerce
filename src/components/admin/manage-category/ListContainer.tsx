'use client'

import { FunctionComponent, ReactNode } from 'react';
import { AddButton } from '@/components/Buttons';
import { SearchInput } from '@/components/Inputs';

interface IListContainer {
    title: {
        title:string; 
        textStyle: string
    };
    addButton?: ({
        title: string;
        click: ()=>void;
        disabled?: boolean;
        loading?:boolean;
    } | null); 
    withSearch?: boolean; 
    isTopLevel?: boolean; 
    additionals?: ReactNode; 
    children: ReactNode;
}

export const ListContainer:FunctionComponent<IListContainer> = ({title, addButton, withSearch, isTopLevel, additionals, children }) => {    
    const useButtonWithLoader = addButton && 'loading' in addButton
    return (
        <div className={`bg-white shadow-md rounded-lg px-3 ${isTopLevel?" py-2 mb-4":"py-1 mb-3"} opacity-100`}>
            <div className="flex justify-between">
                <div className={`block ${title.textStyle} ${isTopLevel?"py-2 px-2":"py-1 px-1"}`}>
                    {title.title}
                </div>
                {
                    addButton &&
                        <AddButton
                            title={addButton.title}
                            onClick={()=>{addButton.click();}}
                            disabled={addButton.disabled?addButton.disabled:false}
                            loading={addButton.loading}
                        />
                }                                
            </div>
            { withSearch && <SearchInput /> }
            { additionals && additionals }
            <div className={`py-${isTopLevel?"3":"2"} text-sm`}>
            { children }
            </div>
            {
                //optional...consider better code in the future
                isTopLevel &&
                <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                    <button className="hover:text-gray-600 text-gray-500 font-bold py-2 px-4">
                        Cancel
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Invite
                    </button>
                </div>
            }
        </div>
    );
}