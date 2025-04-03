import React from 'react'
import {TriangleAlert} from 'lucide-react'

const NoSubTodo = () => {
    return (
        <div className='h-full w-full flex flex-col justify-center items-center'>
            <TriangleAlert size={'150px'}/>
            <p className='text-2xl'>NO SUBTODO IS PRESENT FOR NOW.</p>
        </div>
    )
}

export default NoSubTodo