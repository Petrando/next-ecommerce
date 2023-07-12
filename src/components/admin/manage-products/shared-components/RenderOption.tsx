import { FunctionComponent } from 'react';
import { ICategoryData, IOption, ISubOption } from '../../../../../types';

type IRenderOption =  {
    optionEl:ICategoryData | IOption | ISubOption;
    idx:number;
}

export const RenderOption:FunctionComponent<IRenderOption> = ({optionEl:{_id, category}, idx}) => {
    return (
        <option key={_id} value={idx}>{category}</option>
    )
}