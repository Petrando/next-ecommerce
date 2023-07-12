import { FunctionComponent, ChangeEvent } from 'react';
import { RenderOption } from './RenderOption';
import { ICategoryData, IOption, ISubOption } from '../../../../../types';

type ICategorySelection = {
    label:string;
    id:string;
    value:number;
    onChange:(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>void;
    options:ICategoryData[]|IOption[]|ISubOption[];
}

export const CategorySelection:FunctionComponent<ICategorySelection> = ({label, id, value, onChange, options}) => {
    return (
        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <label 
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' 
                htmlFor={id}
            >
                {label}
            </label>
            <div className='relative'>
                <select 
                    className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' 
                    id={id}
                    value={value}
                    onChange={(e)=>{onChange(e);}}
                >                                    
                    {
                        options.length > 0?options.map((ctg, i)=>{
                            return <RenderOption key={ctg._id} optionEl={ctg} idx={i} />
                        }):
                        <option>Not Available</option>
                    }
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
                </div>
            </div>
        </div>
    );
}