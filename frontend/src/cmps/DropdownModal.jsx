import React, { useEffect,useState } from 'react';
import { useSelector } from "react-redux";
import { DropdownEditLabelPreview } from "./DropdownEditLabelPreview";

export function DropdownModal({
    task,
    table,
    onEditTask,
    onEditBoard
}){

    const board = useSelector(state => state.workspace.currBoard);
    const [boardDropdownLabels , setBoardDropdownLabels ] = useState(board.dropdownLabels);
    const [taskDropdownLabels , setTaskDropdownLabels ] = useState([]);
    const [newDropdownLabels , setNewDropdownLabels ] = useState(board.dropdownLabels);
    const [newLabel , setNewLabel ] = useState({name:'',_id:''});
    const [isEditLabels , setToggleEditLabels ] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setBoardDropdownLabels(board.dropdownLabels)
    }, [board.dropdownLabels])

    useEffect(() => {
        if(task.dropdown){
            setTaskDropdownLabels(task.dropdown)
        }
    }, [task])

    useEffect(() => {        
        let taskLabelsIdArray = []
        task.dropdown.map(label=>
            taskLabelsIdArray.push(label._id)
        )
        let newLabels = board.dropdownLabels.filter(label=>!taskLabelsIdArray.includes(label._id))
        if(search===''){setNewDropdownLabels(newLabels)}
        if(search!==''&&newLabels.length>0){
            setNewDropdownLabels(
                newLabels.filter(label=>label.name.toLowerCase().includes(search))
            )
        }
    }, [task.dropdown,board.dropdownLabels,search])


    function onAddLabelToTask(label) {
        const updatedTask = {
            ...task,
            dropdown: [...task.dropdown, label]
        }
        const desc = `added new label "${label.name}" to task "${task.name}" dropdown column`
        onEditTask(table,updatedTask,desc)
    }
    function onRemoveLabelFromTask(label) {
        const updatedTask = {
            ...task,
            dropdown: task.dropdown.filter(_label=>_label._id!==label._id)
        }
        const desc = `removed label "${label.name}" form task "${task.name}" dropdown column`
        onEditTask(table,updatedTask,desc)
    }
    function onAddLabelToBoard(){
        if(newLabel.name === '')return
        if(newLabel.name&&newLabel.name.trim() === '')return
        const desc = `added new label "${newLabel.name}" to dropdown labels`
        const updatedBoard = {
            ...board,
            dropdownLabels:[
                ...board.dropdownLabels,
                newLabel
            ]
        }
        onEditBoard(updatedBoard,desc)
        setNewLabel({name:'',_id:''})
        setSearch('')
    }
    function onEditBoardLabel(oldLabel,label) {
        const desc = `updated label from "${oldLabel.name}" to "${label.name}" in dropdown labels`
        let updatedBoard = {
            ...board,
            dropdownLabels: board.dropdownLabels.map(_label=>
                _label._id===label._id?label:_label
            )
        }
        onEditBoard(updatedBoard,desc)
        setNewLabel({name:'',_id:''})
        
    }
    function onRemoveLabelFromBoard(label) {
        const desc = `removed label "${label.name}" from dropdown labels`
        const updatedBoard = {
            ...board,
            dropdownLabels: board.dropdownLabels.filter(_label=>
                _label._id!==label._id
            )
        }
        onEditBoard(updatedBoard,desc)
        setNewLabel({name:'',_id:''})
        
    }


    return (
       <>
       <div className="modal-content-wrapper">
       {
           taskDropdownLabels.length>0&&<div className="task-dropdown-labels">
               {taskDropdownLabels.map(label=>
               <div className="dropdown-label"><span>{label.name}</span> <span onClick={()=>onRemoveLabelFromTask(label)}>x</span></div>
                )}
           </div>
        }

       <input type="text" placeholder={`${boardDropdownLabels.length>0?'Create or find labels':'Create a label'}`}
       value={newLabel.name}
       onChange={(e)=>{
           setNewLabel({name:e.target.value,_id:Date.now()})
            setSearch(e.target.value.toLowerCase())
        }}
       onKeyDown={(e) => {
            if (e.key === 'Enter') {
                if(e.target.value.trim().length<1)return
                setNewLabel({name:e.target.value,_id:Date.now()})
                onAddLabelToBoard()
            }
        }}
       />

        {
           newDropdownLabels.length>0&&
           <div className={`baord-dropdown-labels ${!isEditLabels?'aplay':''}`}>
               {newDropdownLabels.map(label=>
                    !isEditLabels?
                    <div className="dropdown-baord-label" onClick={()=>onAddLabelToTask(label)}>{label.name}</div>
                    :
                    <DropdownEditLabelPreview
                        label={label}
                        onEditBoardLabel={onEditBoardLabel}
                        onRemoveLabelFromBoard={onRemoveLabelFromBoard}
                    />
                )}
           </div>
        }

       <div className={`create-btn ${newLabel.name?'add':''}`} onClick={onAddLabelToBoard}>+ Create new label</div>
       </div>
        <div className="edit-btn" onClick={()=>setToggleEditLabels(prev=>!prev)}>
           {isEditLabels?'Apply':'Edit labels'}
        </div>
        </>
    )
}

