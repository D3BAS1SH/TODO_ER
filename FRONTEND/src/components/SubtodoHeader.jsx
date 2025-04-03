import { Button } from '@heroui/button'
import { 
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Input
} from '@heroui/react';
import React, { useState } from 'react'

const SubtodoHeader = () => {

    const [newSubTodo,setNewSubTodo] = useState(["Hello","Bye","Good day"]);

    const {isOpen,onClose,onOpen} = useDisclosure();

    const handleOnPressModal = () => {
        onOpen()
    }

    return (
        <Navbar>
            <NavbarBrand className='text-[32px] font-bold'>
                Heading
            </NavbarBrand>
            <NavbarContent justify='left'>
                <NavbarItem>
                    <Button variant='shadow' color='primary' onPress={handleOnPressModal}>ADD</Button>
                    <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} placement='center' size='2xl'>
                        <ModalContent>
                            {
                                (onClose)=>(
                                    <>
                                        <ModalHeader>ADD SUBTODOS</ModalHeader>
                                        <ModalBody>
                                            {
                                                (!!newSubTodo.length)
                                                &&
                                                newSubTodo.map(item=>{
                                                    return <div className='text-center font-semibold'>
                                                        {
                                                            item
                                                        }
                                                    </div>
                                                })
                                            }
                                            <Button fullWidth variant='flat'>ADD MORE</Button>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color='warning' variant='ghost' onPress={onClose}>CANCEL</Button>
                                            <Button color='primary' variant='ghost'>SUBMIT</Button>
                                        </ModalFooter>
                                    </>
                                )
                            }
                        </ModalContent>
                    </Modal>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default SubtodoHeader