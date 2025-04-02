import { 
    Checkbox,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    Button,
    Input
} from '@heroui/react';
import { Trash2, FilePenLine } from 'lucide-react';
import React, { useState } from 'react'
import { useTodo, useTodoAllTodo, useTodoSelectedTodo } from '../hooks/useTodo.hook';
import { useToast } from '../contexts/ToastContext';

const TodoItem = () => {
    
    const { onClose, onOpen, isOpen } = useDisclosure();
    const [ itemState, setItemState ] = useState({ Heading:"", Color:"", Completed:"" });
    const [ toEdit, setToEdit ] = useState(null);

    const { deleteTodoDispatcher, updateTodoDispatcher, selectTodoDispatcher } = useTodo();
    const { todos } = useTodoAllTodo();
    const { selectedTodo } = useTodoSelectedTodo();
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

    const handleUpdateHit = async() => {
        try {
            const responseFromThunk = await updateTodoDispatcher({...itemState,id:toEdit._id});
            if(responseFromThunk.type === "todo/UpdateATodo/rejected"){
                throw new Error(responseFromThunk.payload);
            }
            setItemState({ Heading:"", Color:"", Completed:"" });
            setToEdit(null);
            showToast("Todo Updated!!","success");
            onClose();
        } catch (error) {
            showToast(error?.message || "Some error happened at updation.","error");
        }
    }

    const handleModalOpenning = (ToEdit) => {
        setToEdit(ToEdit);
        setItemState({
            Heading:ToEdit.Heading,
            Color:ToEdit.Color,
            Completed:ToEdit.Completed
        })
        onOpen();
    }

    const handlerUpdateChanges = (e) => {
        const {value,name} = e.target;
        setItemState(item=>({
            ...item,
            [name]:value
        }))
        console.log(itemState);
    }

    const handleSelectTodo = (id) => {
        selectTodoDispatcher(id);
    }

    return (
        <div>
            {
                todos.map(itemName=>{
                    return (
                    <div
                    className={`flex flex-row justify-between items-center mb-4 p-2 rounded z-50 cursor-pointer ${selectedTodo === itemName._id ? 'bg-gray-200' : ''}`}
                    key={itemName._id}
                    onClick={(e)=>{
                        e.stopPropagation();
                        console.log("Clicked the component main")
                        handleSelectTodo(itemName._id)
                    }}
                    >
                        <Checkbox 
                        key={itemName._id} 
                        value={itemName._id} 
                        isSelected={itemName.Completed}
                        >
                            <p 
                            style={{color:itemName.Color}} 
                            className='font-semibold'
                            
                            >
                                {itemName.Heading}
                            </p>
                        </Checkbox>
                        <div className='flex flex-row z-10'>

                            <FilePenLine 
                            size={'20px'}
                            onClick={(e)=>{
                                e.preventDefault();
                                e.stopPropagation();
                                handleModalOpenning(itemName);
                            }}
                            />

                            <Trash2 
                            size={'20px'}
                            onClick={(e)=>{
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteHit(itemName._id);
                            }}
                            />

                        </div>
                    </div>
                )})
            }
            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} placement='auto' size='lg'>
                <ModalContent>
                    {
                        (onClose)=>(
                            <>
                                <ModalHeader>Update Todo</ModalHeader>
                                <ModalBody>
                                    <Input value={itemState.Heading} name='Heading' label={'Heading'} type={'text'} variant='bordered' onChange={handlerUpdateChanges}/>
                                    <Input value={itemState.Color} name='Color' label={'Color'} type={'color'} variant='bordered' onChange={handlerUpdateChanges}/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='warning' variant='ghost' onPress={onClose}>CANCEL</Button>
                                    <Button color='primary' variant='ghost' onPress={handleUpdateHit}>UPDATE</Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}

export default TodoItem