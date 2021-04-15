import React from 'react';
import { useSelector } from "react-redux";
import { HiOutlineDocumentDuplicate} from 'react-icons/hi'
import { IoArrowForwardCircleOutline} from 'react-icons/io5'
import { MdClose} from 'react-icons/md'
import { BsTrash} from 'react-icons/bs'

export function MultipleActionsModal({checkedTasks,onUnCheckTasks,onEditBoard}) {

    const board = useSelector(state => state.workspace.currBoard);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    
    const onRemoveCheckedTasks =()=>{
        let ids = []
        let tables = []
        let removedTasks=[]
        let descArray=[]
        const seen = new Set();
        checkedTasks.forEach(item=>
             {ids.push(item._id)
             tables.push(item.table)}
         )
        //removing duplicated tables from array
        const filteredTables = tables.filter(el => {
            const duplicate = seen.has(el._id);
            seen.add(el._id);
            return !duplicate;
        });
        let newTablesArray = []  //array for the updated tables (after removing tasks)
        filteredTables.forEach(table => {
           const newTable = {
               ...table,
               tasks:table.tasks.filter(task=>!ids.includes(task._id))
           }
           newTablesArray.push(newTable)
           removedTasks = table.tasks.filter(task=>ids.includes(task._id))
           removedTasks.forEach(task=>{
               const desc = `removed task "${task.name}" from "${table.name}"`
                descArray.push(desc) //to update desc inside board activities
           })
        })
        
        const newBoard = {
            ...board,
            //replace objects in board.tables with updated tables from newTablesArray with same _id.
            tables:board.tables.map(tableObj => newTablesArray.find(newTableObj => newTableObj._id === tableObj._id) || tableObj)
        }

        onEditBoard(newBoard,descArray)
        onUnCheckTasks()
    }


    const onDuplicateCheckedTasks =()=>{
        let ids = []
        let tables = []
        let duplicatedTasks=[]
        let descArray=[]
        const seen = new Set();
        checkedTasks.forEach(item=>
             {ids.push(item._id)
             tables.push(item.table)}
         )
        //removing duplicated tables from array
        const filteredTables = tables.filter(el => {
            const duplicate = seen.has(el._id);
            seen.add(el._id);
            return !duplicate;
        });
        let newTablesArray = []  //array for the updated tables (after duplicate tasks)
        filteredTables.forEach(table => {
           const newTable = {
               ...table,
               tasks:table.tasks.flatMap((task)=>ids.includes(task._id)?
               [task,
                {
                    ...task,
                    _id : Date.now().toString(16) + Math.random().toString(16),
                    createdAt : Date.now(),
                    lastUpdated : {
                        byUser : loggedInUser._id,
                        date : new Date().getTime()
                    }
                }]
               :task)
           }
           newTablesArray.push(newTable)
           duplicatedTasks = table.tasks.filter(task=>ids.includes(task._id)) 
           duplicatedTasks.forEach(task=>{
               const desc = `duplicate task "${task.name}" inside "${table.name}"`
                descArray.push(desc) //to update desc inside board activities
           })
        })
        
        const newBoard = {
            ...board,
            //replace objects in board.tables with updated tables from newTablesArray with same _id.
            tables:board.tables.map(tableObj => newTablesArray.find(newTableObj => newTableObj._id === tableObj._id) || tableObj)
        }

        onEditBoard(newBoard,descArray)
        onUnCheckTasks()
    }


    return(
        <div className="multiple-actions-modal slide-top">
            <div className="items-count-wrapper">{checkedTasks.length}</div>
            <div>
                <div className="middle-section">
                    <div className="selected-items">
                        <div className="title">Item{`${checkedTasks.length>1?'s':''}`} selected</div>
                        <div className="dots-container">
                            {checkedTasks.map(task=>
                                <div className="dot"></div>
                            )}
                        </div>
                    </div>
                    <div className="options-wrapper">
                        <div className="option-btn">
                            <HiOutlineDocumentDuplicate className="icon" onClick={onDuplicateCheckedTasks}/>
                            <div className="name">Duplicate</div>
                        </div>
                        <div className="option-btn">
                            <BsTrash className="icon" onClick={onRemoveCheckedTasks}/>
                            <div className="name">Delete</div>
                        </div>
                        <div className="option-btn opacity-for-currently-unavailable-btns">
                            <IoArrowForwardCircleOutline className="icon"/>
                            <div className="name">Move to</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="close-btn" 
            onClick={onUnCheckTasks}
            >
              <MdClose/>
            </div>
    </div>
    )
}