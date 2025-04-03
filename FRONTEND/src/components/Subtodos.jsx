import React from 'react'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useTodoSelectedTodo } from "../hooks/useTodo.hook.js";
import { useSubTodoGetAllOf } from "../hooks/useSubTodo.hook.js";
import SubtodoItems from './SubtodoItems.jsx';

const Subtodos = () => {

  const { selectedTodo } = useTodoSelectedTodo();
  const { requiredSubTodo } = useSubTodoGetAllOf(selectedTodo);

  return (
    <ScrollShadow className='w-full h-full overflow-y-auto p-6'>
      <SubtodoItems SubTodoToRender={requiredSubTodo}/>
    </ScrollShadow>
  )
}

export default Subtodos