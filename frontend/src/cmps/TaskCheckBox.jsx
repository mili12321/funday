import React, { useEffect,useState } from 'react';
import { FaCheck} from 'react-icons/fa'

export function TaskCheckBox({onEditTask,table,task}){
    const [check, setCheck] = useState(false);

    useEffect(() => {
        if(task.checkBox){
            setCheck(task.checkBox)
        }
    }, [task])

    const toggleCheck=(val)=>{
        setCheck(val)
        const updatedTask = {
            ...task,
            checkBox: val
        }
        const desc = `${val?"unchecked":"checked"} task "${updatedTask.name}" inside ${table.name}`
        onEditTask(table,updatedTask,desc)
    }
    return (
        <div 
        className="task-check-box"  
        onClick={()=>toggleCheck(!check)}>
            {
            task.checkBox?
            <FaCheck className="icon green"/>
            :''
            }
        </div>
    )
}