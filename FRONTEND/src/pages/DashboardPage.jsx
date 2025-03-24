import { useState } from "react"
import Todos from "../components/Todos"
import Subtodos from "../components/Subtodos"
import TodoHeader from "../components/TodoHeader"

const DashboardPage = () => {

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
