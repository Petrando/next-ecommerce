import { FunctionComponent, ChangeEvent} from 'react'

interface IConditionRadio {
    id:string;
    label:string;    
    checked:boolean;
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
}

export const ConditionRadio:FunctionComponent<IConditionRadio> = ({id, label, checked, onChange}) => {
    return (
        <div className='flex items-center mr-1'>
            <input 
                id={id}
                type='radio'                                         
                name={id}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2' 
                checked={checked}
                onChange={onChange}                                        
            />
            <label htmlFor={id} className='ml-2 text-sm font-medium text-gray-700'>{label}</label>
        </div>
    );
}