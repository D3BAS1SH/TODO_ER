import { Checkbox } from '@heroui/react'
import { Trash2 } from 'lucide-react';
import React from 'react'
import { useTodoAllTodo } from '../hooks/useTodo.hook';

const TodoItem = () => {
    
    const {todos} = useTodoAllTodo();

    return (
        <div>
            {
                todos.map(itemName=>{
                    return <div className='flex flex-row justify-between'>
                        <Checkbox key={itemName._id} value={itemName._id} isSelected={itemName.Completed}>
                            <p style={{color:itemName.Color}} className='font-semibold'>
                                {itemName.Heading}
                            </p>
                        </Checkbox>
                        <Trash2 size={'20px'}/>
                    </div>
                })
            }
        </div>
    )
}

export default TodoItem