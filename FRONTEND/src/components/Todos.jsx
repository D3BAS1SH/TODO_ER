import React from 'react'
import { ScrollShadow } from '@heroui/scroll-shadow'
import TodoItem from './TodoItem'

const Todos = () => {
  return (
    <ScrollShadow className='w-full h-full overflow-y-auto p-6'>
      <TodoItem/>
    </ScrollShadow>
  )
}

export default Todos