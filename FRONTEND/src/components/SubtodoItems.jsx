import React from 'react'
import SubTodoSingleItem from './SubTodoSingleItem'
import NoSubTodo from './NoSubTodo'
import { Plus } from 'lucide-react'
import { Input, Modal, ModalBody, ModalContent, ModalHeader, Button, ModalFooter, useDisclosure } from '@heroui/react'

const values = [
    {
        completion:true, Content:"HELLO WORLD", Color:"#f00",id:1
    },
    {
        completion:false, Content:"Bye WORLD", Color:"#050",id:2
    },
    {
        completion:true, Content:"HELLO WORLD", Color:"#050",id:3
    },
    {
        completion:false, Content:"Bye WORLD", Color:"#050",id:4
    },
]

const SubtodoItems = ({SubTodoToRender}) => {

    const {isOpen,onClose,onOpen} = useDisclosure();

    return (
        <div className='flex flex-col gap-8 h-full w-full'>
            {
                (!!values.length)?
                values.map(item=>{
                    return <SubTodoSingleItem key={item.id} Color={item.Color} Content={item.Content} Completion={item.completion}/>
                })
                :
                <NoSubTodo/>
            }
            <Button fullWidth={true} variant='solid' radius='sm' onPress={onOpen}>
                <div className='flex flex-row justify-center items-center gap-3'>
                    <Plus/>
                    <p className='font-semibold text-[#494949]'>
                        ADD ONE MORE
                    </p>
                </div>
            </Button>
            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} placement='center' size='lg'>
                <ModalContent>
                    {
                        (onClose)=>(
                            <>
                                <ModalHeader>ADD SUBTODO</ModalHeader>
                                <ModalBody>
                                    <Input name='Content'/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant='ghost' color='warning'>CANCEL</Button>
                                    <Button variant='ghost' color='primary'>SUBMIT</Button>
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