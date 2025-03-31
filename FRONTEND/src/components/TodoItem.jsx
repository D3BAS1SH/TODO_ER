import { Checkbox } from '@heroui/react'
import { Trash2 } from 'lucide-react';
import React from 'react'
import { useTodo, useTodoAllTodo } from '../hooks/useTodo.hook';
import { useToast } from '../contexts/ToastContext';

const TodoItem = () => {
    
    const {deleteTodoDispatcher} = useTodo();
    const {todos} = useTodoAllTodo();
    const { showToast } = useToast();

    const handleDeleteHit = async(id) => {
        try {
            const responeFromThunk = await deleteTodoDispatcher(id);
            if(responeFromThunk.type === "todo/DeleteATodo/rejected"){
                throw new Error(responeFromThunk.payload);
            }
            showToast("Id removed successfully","success");
        } catch (error) {
            showToast(error.message||"Some error happened at deletion","error");
        }
    }

    return (
        <div>
            {
                todos.map(itemName=>{
                    return <div className='flex flex-row justify-between items-center' key={itemName._id}>
                        <Checkbox key={itemName._id} value={itemName._id} isSelected={itemName.Completed}>
                            <p style={{color:itemName.Color}} className='font-semibold'>
                                {itemName.Heading}
                            </p>
                        </Checkbox>
                        <div className='z-50'>

                            <Trash2 
                            size={'20px'}
                            onClick={(e)=>{
                                e.stopPropagation();
                                handleDeleteHit(itemName._id);
                            }}
                            />

                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default TodoItem