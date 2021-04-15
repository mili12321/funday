import React, { useEffect,useState,useRef } from 'react';

export function TaskNumbersColumn({onEditTask,table,task,setUpdatingNumbers}){
    const [numbers, setNumbers] = useState('');
    const [isUpdating, setUpdateNumbers] = useState(false);
    const inputRef = useRef()

    useEffect(() => {
        if(task.numbers){
            setNumbers(task.numbers)
        }
    }, [task])

    const onUpdating=()=>{
        setUpdateNumbers(true)
        setUpdatingNumbers(true)
        setTimeout(() => {
            inputRef.current.focus()
           }, 0);
    }


    return (
        <div
         className="task-text numbers" onClick={onUpdating}
         title={numbers}
         >
            {isUpdating?
                <div className="updating-container">
                    <input 
                    type="number"
                    className='numbers'
                    onChange={(e)=>setNumbers(e.target.value)} 
                    value={numbers}
                    onBlur={()=>
                        {
                            if(numbers===task.numbers){
                                setUpdateNumbers(false)
                                setUpdatingNumbers(false)
                                return
                            }
                            const updatedTask = {
                                ...task,
                                numbers: numbers
                            }
                            const desc = `changed task "${task.name}" numbers to "${numbers}"`
                            onEditTask(table,updatedTask,desc)
                            setUpdateNumbers(false)
                            setUpdatingNumbers(false)
                        }
                    }
                    ref={inputRef}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.target.blur()
                        }
                    }}
                    />
                    
                </div>
                    :
                <div className="text-content">
                     <span>{numbers}</span>
                </div>
            }
        </div>
    )
}