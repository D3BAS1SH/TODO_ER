import React from 'react'
import {Plus} from 'lucide-react'
import { Navbar, NavbarContent } from '@heroui/navbar'
import { Button } from '@heroui/button'

const TodoHeader = () => {
  return (
    <Navbar>
        <NavbarContent>
            <Button color='primary' variant='flat' fullWidth radius='sm'>
                <Plus size="32px"/>
            </Button>
        </NavbarContent>
    </Navbar>
  )
}

export default TodoHeader