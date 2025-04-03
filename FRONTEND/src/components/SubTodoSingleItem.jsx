import React, { useState } from 'react'
import { Switch, Button } from '@heroui/react';
import { EllipsisVertical } from 'lucide-react';

const SubTodoSingleItem = ({ Completion, Content, Color }) => {
    const [selectValue,setSelectValue] = useState(Completion);

    return (
        <div className='flex items-center justify-evenly w-full p-2 rounded-md shadow-lg'>
            <Switch isSelected={selectValue} onValueChange={setSelectValue}/>
            <p style={{color:Color}} className={`flex-1 text-center text-sm font-medium ${selectValue?'line-through':''}`}>
                {Content}
            </p>
            <Button variant='flat' color='none'>
                <EllipsisVertical size={'32px'}/>
            </Button>
        </div>
    )
}

export default SubTodoSingleItem