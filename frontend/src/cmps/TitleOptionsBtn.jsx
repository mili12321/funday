import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TiArrowSortedDown } from 'react-icons/ti'
import { VscTrash } from 'react-icons/vsc'
import { BiHide } from 'react-icons/bi'

export function TitleOptionsBtn({toggleTitleOptionsModal,isShownTitleOptionsModal,closeTitleOptionsModal,tableColumn,onEditBoard,table,onEditTable,onEditTask }) {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const board = useSelector(state => state.workspace.currBoard);
    const divEl = useRef()

    const getDefaultValue =(taskKey)=>{
        switch (taskKey) {
            case 'owner':
            case 'dropdown':
            case 'tags':
                return [] 
            case 'status':
                return {
                    name : "",
                    color : "rgb(180, 182, 188)"
                }
            case 'timeline':
                return {
                    from : "",
                    to : ""
                } 
            case 'lastUpdated':
                return  {
                    byUser : '',
                    date :''
                }
            default:
                return null;
        }

    }

    useEffect(() => {
        if(isShownTitleOptionsModal&&divEl&&divEl.current){
            divEl.current.focus()
        }
    }, [isShownTitleOptionsModal])

    const deleteColumn=()=>{
        let newTablesArray = []  //array for the updated tables
        const desc = `removed '${tableColumn.taskKey}' column`

        board.tables.forEach(table => {
            const newTable = {
                ...table,
                tasks:table.tasks.flatMap((task)=>
                    [{...task,[`${tableColumn.taskKey}`]:getDefaultValue(tableColumn.taskKey)}]
                )
            }
            newTablesArray.push(newTable)
        })
         

        const updatedBoard = {
            ...board,
            tables:board.tables.map(tableObj => newTablesArray.find(newTableObj => newTableObj._id === tableObj._id) || tableObj),
            tableColumns: board.tableColumns.filter(column=>column._id!==tableColumn._id),
            activities:[
                {
                    desc: desc,
                    userId: loggedInUser._id,
                    createdAt: Date.now()
                },
                ...board.activities]
        }
       
        onEditBoard(updatedBoard)
        toggleTitleOptionsModal()
    }

   const hideColumn=()=>{
    const desc = `hide '${tableColumn.taskKey}' column`
    const updatedBoard = {
        ...board,
        tableColumns: board.tableColumns.filter(column=>column._id!==tableColumn._id),
        activities:[
            {
                desc: desc,
                userId: loggedInUser._id,
                createdAt: Date.now()
            },
            ...board.activities]
    }
    onEditBoard(updatedBoard)
    toggleTitleOptionsModal()
}

    return(
        <div className='title-cell-options-wrapper'>
            <div 
            className={`title-cell-options-btn ${isShownTitleOptionsModal?'updating':''}`}
            onClick={toggleTitleOptionsModal}
            >
                <TiArrowSortedDown/>
            </div>
            {isShownTitleOptionsModal&&
                <div 
                className='modal-default-style title-cell-options-modal' 
                ref={divEl}
                tabIndex='0'
                onBlur={()=>{
                    closeTitleOptionsModal()
                }}
                >
                    <div className="delete-btn modal-btn" onClick={hideColumn}>
                        <BiHide className='icon'/><span>Hide column</span>
                    </div>
                    <div className="delete-btn modal-btn" onClick={deleteColumn}>
                        <VscTrash className='icon'/><span>Delete column</span>
                    </div>
                </div>
            }
        </div>
    )
    
}