import React, { useEffect, useState } from 'react'
import SubTodoSingleItem from './SubTodoSingleItem'
import NoSubTodo from './NoSubTodo'
import { Plus } from 'lucide-react'
import { Input, Modal, ModalBody, ModalContent, ModalHeader, Button, ModalFooter, useDisclosure, input } from '@heroui/react'
import { useSubTodo, useSubTodoLoading } from '../hooks/useSubTodo.hook.js'
import { useToast } from '../contexts/ToastContext.jsx'

const SubtodoItems = ({SubTodoToRender,Parent}) => {

    const {isOpen,onClose,onOpen} = useDisclosure();
    const { createSubTodoDispatcher } = useSubTodo();
    const { showToast } = useToast();
    const { loading } = useSubTodoLoading();

    const [incomingSubtodos,setIncomingSubtodos] = useState([]);
    const [inputState,setInputState] = useState({Content:"",Color:"#404040"})
    const [debounceColor,setDebounceColor] = useState(inputState.Color);

    useEffect(()=>{
        setIncomingSubtodos(SubTodoToRender?.subtodos||[]);
    },[SubTodoToRender])

    const handleInputChange = (e) => {
        e.preventDefault();
        const {name,value} = e.target;

        if(name==="Content"){
            setInputState(prev=>({...prev,Content:value}))
        }else if(name === "Color"){
            setDebounceColor(value);
        }
        console.log(inputState);
    }

    const handleOnClick = async() => {
        try {
            console.log("Hitting Dispatcher to create.");
            const responseThunk = await createSubTodoDispatcher({id:Parent,Content:inputState.Content,Color:inputState.Color,Completed:false});
            if(responseThunk.type==="subtodo/createSubTodo/rejected"){
                throw new Error(responseThunk.payload);
            }
            setInputState({Color:"#404040",Content:""});
            setDebounceColor("#404040")
            showToast("New Subtodo added","success");
            onClose();
        } catch (error) {
            console.error(error.message||"Some error happened at creating SubTodo.");
            showToast(error.message||"Some error happened at creating SubTodo.","error");
        }
    }

    const handleOnCancelHit = () => {
        setInputState((state)=>{
            return {Color:"#404040",Content:""}
        })
        setDebounceColor("#404040");
        onClose()
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setInputState(prev=>({...prev,Color:debounceColor}));
        },200)

        return ()=>clearTimeout(timer);
    },[debounceColor])

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='flex-1 overflow-y-auto flex flex-col gap-4'>
                {
                    (!!incomingSubtodos.length)?
                    incomingSubtodos.map(item=>{
                        console.log(item);
                        return <SubTodoSingleItem
                        key={item._id}
                        id={item._id}
                        Color={item.Color}
                        Content={item.Content}
                        Completion={item.Completed}
                        parent={item.Parent}
                        />
                    })
                    :
                    <NoSubTodo/>
                }
            </div>
            <div>
                <Button fullWidth={true} variant='solid' radius='sm' onPress={onOpen}>
                    <div className='flex flex-row justify-center items-center gap-3'>
                        <Plus/>
                        <p className='font-semibold text-[#494949]'>
                            ADD ONE MORE
                        </p>
                    </div>
                </Button>
            </div>
            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} placement='center' size='4xl'>
                <ModalContent>
                    {
                        (onClose)=>(
                            <>
                                <ModalHeader>ADD SUBTODO</ModalHeader>
                                <ModalBody>
                                    <div className='grid grid-cols-10 gap-4'>
                                        <div className='col-span-7 h-full w-full'>
                                            <Input name='Content' type='text' value={inputState.Content} onChange={handleInputChange}/>
                                        </div>
                                        <div className='col-span-3 h-full w-full'>
                                            <Input name="Color" type='color' value={debounceColor} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                    variant='ghost'
                                    color='warning'
                                    onPress={handleOnCancelHit}
                                    >
                                        CANCEL
                                    </Button>

                                    <Button
                                    variant='ghost'
                                    color='primary'
                                    onPress={handleOnClick}
                                    isLoading={loading}
                                    >
                                        SUBMIT
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SubtodoItems