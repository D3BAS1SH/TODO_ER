import React, { useEffect, useState } from 'react'
import { Switch, Button } from '@heroui/react';
import { EllipsisVertical,Trash2 } from 'lucide-react';
import { useSubTodo } from '../hooks/useSubTodo.hook';
import { useToast } from '../contexts/ToastContext';

const SubTodoSingleItem = ({ Completion, Content, Color, id, parent }) => {
    const [selectValue,setSelectValue] = useState(Completion);
    const [ids,setIds] = useState({subTodoId:null,parentId:null});

    useEffect(()=>{
        setIds({parentId:parent,subTodoId:id});
    },[id,parent])

    const { deleteSubTodoDispatcher } = useSubTodo();
    const { showToast } = useToast();

    const handleDeletePress = async() => {
        try {
            console.log(ids);
            const response = await deleteSubTodoDispatcher({subTodoId:ids.subTodoId,parentId:ids.parentId})
            if(response.type==="subtodo/deleteSubTodo/rejected"){
                throw new Error(response.payload||"Deletion failed");
            }
            showToast("Deletion completed","success");
        } catch (error) {
            console.error(error.message||"Some error happened at deleting SubTodo.");
            showToast(error.message||"Some error happened at deleting SubTodo.","error");
        }
    }

    return (
        <div className='flex items-center justify-evenly w-full p-2 rounded-md shadow-lg'>
            <Switch isSelected={selectValue} onValueChange={setSelectValue}/>
            <p style={{color:Color}} className={`flex-1 text-center text-sm font-medium ${selectValue?'line-through':''}`}>
                {Content}
            </p>
            <div className='flex flex-row gap-4'>
                <Button variant='flat' color='none'>
                    <EllipsisVertical size={'32px'}/>
                </Button>
                <Button variant='flat' color='none' onPress={handleDeletePress}>
                    <Trash2 size={'28px'}/>
                </Button>
            </div>
        </div>
    )
}

export default SubTodoSingleItem