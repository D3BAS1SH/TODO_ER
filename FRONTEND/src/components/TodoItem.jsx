import { Checkbox, CheckboxGroup } from '@heroui/react'
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'

const TodoItem = ({TodoItems}) => {
    
    const Items = ['lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5',
        'lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5','lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5',
        'lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5','lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5',
        'lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5','lorem 1', 'lorem 2', 'lorem 3', 'lorem 4', 'lorem 5'
    ];
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectionChange = (selectedValues) => {
        setSelectedItems(selectedValues);
    };

    return (
        <CheckboxGroup value={selectedItems} onChange={handleSelectionChange}>
            {
                Items.map(itemName=>{
                    return <div className='flex flex-row justify-between'>
                        <Checkbox key={itemName} id={itemName} value={itemName}>
                            {itemName}
                        </Checkbox>
                        <Trash2 size={'20px'}/>
                    </div>
                })
            }
        </CheckboxGroup>
    )
}

export default TodoItem