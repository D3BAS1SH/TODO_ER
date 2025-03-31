import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Navbar, NavbarContent } from '@heroui/navbar'
import { Button } from '@heroui/button'
import {Input, Modal,ModalBody,ModalContent,ModalFooter,ModalHeader,useDisclosure} from "@heroui/react"
import { useTodo, useTodoError, useTodoLoading } from '../hooks/useTodo.hook';
import { useToast } from '../contexts/ToastContext'

const TodoHeader = () => {
  const {isOpen,onOpen,onClose} = useDisclosure();
  const [inputValue,setInputValue] = useState("");
  const [color,setColor] = useState("#454545");

  const {loading} = useTodoLoading();
  const {error} = useTodoError();
  const {createTodoDispatcher} = useTodo();
  const { showToast } = useToast();

  const handleButtonPressModal = () => {
    onOpen();
  }

  const handleButtonCancel = () =>{
    onClose();
  }

  const handleCreation = async() =>{
    try {  
      console.log(`Heading : ${inputValue}, Color : ${color}`);
      const TodoObject = {Heading:inputValue.trim(),Color:color.trim()}
      await createTodoDispatcher(TodoObject);
      showToast("Todo Created Successfully","success");
      onClose();
      setInputValue("");
      setColor("#454545");
      // toast.success("Todo Created Successfully");
    } catch (err) {
      // toast.error(error || "Some Error Happened");
      showToast(err||"Some Error Happened","error");
      console.log(error);
    }
  }

  const handleColorChange = (e) => {
    e.preventDefault();
    setColor(e.target.value);
    console.log(color)
  }

  const handleOnChangeInput = (e) => {
    e.preventDefault();
    const {value} = e.target;
    setInputValue(value);
    console.log(inputValue)
  }

  return (
    <Navbar>
        <NavbarContent>
            <Button color='primary' variant='flat' fullWidth radius='sm' onPress={handleButtonPressModal}>
                <Plus size="32px"/>
            </Button>
            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} placement='center' size='lg'>
              <ModalContent>
                {
                  (onClose)=>(
                    <>
                      <ModalHeader>Add Todo</ModalHeader>
                      <ModalBody>
                        <div className='flex w-full items-center gap-2'>
                            <Input value={inputValue} onChange={handleOnChangeInput} placeholder='Todo Header'/>
                            <Input type='color' value={color} onChange={handleColorChange}/>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color='warning' variant='ghost' onPress={handleButtonCancel}>CANCEL</Button>
                        <Button color='primary' variant='ghost' onPress={handleCreation} isLoading={loading}>SUBMIT</Button>
                      </ModalFooter>
                    </>
                  )
                }
              </ModalContent>
            </Modal>
        </NavbarContent>
    </Navbar>
  )
}

export default TodoHeader