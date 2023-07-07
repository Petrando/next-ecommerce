'use client'
import { FunctionComponent } from 'react'

interface IListDot {
    isNew?: boolean;
}

export const ListDot:FunctionComponent<IListDot> = ({isNew}) => {
    /*isNew is optional, just to mark if this is a new element to be added to the list*/    
    const dotColor = `bg-${isNew?"emerald":"gray"}-400`;
    
    return (
        <span className={`${dotColor} h-2 w-2 m-2 rounded-full`} />
    )
}