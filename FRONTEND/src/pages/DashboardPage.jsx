import { useEffect, useState } from "react"
import Todos from "../components/Todos"
import Subtodos from "../components/Subtodos"
import TodoHeader from "../components/TodoHeader"
import {useTodo} from "../hooks/useTodo.hook";

const DashboardPage = () => {

  const {getAllTodoDispatcher} = useTodo();

  useEffect(()=>{
    getAllTodoDispatcher({page:1,limit:5});
  },[])

  return (
    <div className="grid grid-cols-12 h-full gap-2">
      <div className="col-span-2 h-full flex flex-col overflow-hidden">
        <TodoHeader/>
        <div className="flex-1 overflow-hidden">
          <Todos/>
        </div>
      </div>
      <div className="col-span-10 overflow-hidden">
        <Subtodos/>
      </div>
    </div>
  )
}

export default DashboardPage
