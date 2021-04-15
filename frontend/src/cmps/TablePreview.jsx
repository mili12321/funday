import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Task } from "./Task";
import { TableColumnPreview } from "./TableColumnPreview";
import { TiArrowSortedDown } from 'react-icons/ti'
import { VscTrash } from 'react-icons/vsc'
import { FaPencilAlt } from 'react-icons/fa'
import {BsCircleFill,BsTrashFill } from 'react-icons/bs'
import { DragDropContext,Droppable ,Draggable   } from 'react-beautiful-dnd';
import { BiGridVertical } from 'react-icons/bi'
import { CgExpand } from 'react-icons/cg'
import { AiOutlineShrink } from 'react-icons/ai'
import { GoThreeBars } from 'react-icons/go'
import { IoTextSharp } from 'react-icons/io5'
import { BsPeopleCircle,BsBoxArrowDown } from 'react-icons/bs'
import { MdDateRange } from 'react-icons/md'
import { TiSortNumerically } from 'react-icons/ti'
import { FcTimeline } from 'react-icons/fc'
import { HiHashtag } from 'react-icons/hi'
import { MdUpdate } from 'react-icons/md'
import { IoMdCheckboxOutline } from 'react-icons/io'
import {colorsPicker} from '../data/colorPicker'
import { loadUsers } from '../store/actions/userActions'
import { getColumnWidth } from "./task-cells-width.js";

export function TablePreview({
    taskKeys,
    table,
    IoMdNotifications,
    HiPlusCircle,
    onAddNewTask,
    onEditTask,
    onEditTable,
    onEditBoard,
    onRemoveTask,
    removeTable,
    openConversationModal,
    dragHandle,
    isDragging,
    isShrink,
    onShrink,
    search,
    unCheckTasks,
    provided,
    updateBoard
}){

    const users = useSelector(state => state.user.users);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const board = useSelector(state => state.workspace.currBoard);
    const [newTaskName, setNewTaskName] = useState('');
    const [isInputBtnVisable, setIsInputBtnVisable] = useState(false);
    const [isShowTableOptionsModal, setIsShowTableOptionsModal] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isOpenTableColorModal, setIsOpenTableColorModal] = useState(false);
    const [tableCopy, setTableCopy] = useState(table);
    const [isExpand, setExpandTable] = useState(true);
    const [allOwners, setAllOwners] = useState([]);
    const [allTablestatuses, setAllTablestatuses] = useState({});
    const [statusTitles , setStatusTitles] = useState([]);
    const [statusesSum , setStatusesSum] = useState([]);
    const colorModal = useRef(null)
    const [isShowAddColumnModal, setToggleAddColumnModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUsers())
    }, [dispatch])    
    
    
    function mapOrder (array, order, key) {
        array.sort( function (a, b) {
          var A = a[key], B = b[key];
          if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
          } else {
            return -1;
          }
        });
        return array;
    };

    
    useEffect(() => {
        let idList = []
        table.tasks.map(task=>
            idList=[...idList,  ...task.owner]
        )
        const uniqIdList = [...new Set(idList)];
        const usersArray = users.filter(user=>
                    uniqIdList.includes(user._id)
                )
        const orderedArray = mapOrder(usersArray, uniqIdList, '_id');
        setAllOwners(orderedArray)
        // setAllOwners(
        //     users.filter(user=>
        //         uniqIdList.includes(user._id)
        //     )
        // )
    }, [table,table.tasks,newTaskName,users]) 


     useEffect(() => {
        let list = []
        let statusesNameInUse = []
        table.tasks.map((task,idx)=>
            {list= [...list,task.status]
            statusesNameInUse = [...statusesNameInUse,task.status.name]}
        )   
        const sortedList = list.sort((a, b) => a.name.localeCompare(b.name)) 
        setStatusesSum( list.length)
        //string of the exisiting used status names in the table
        //sorted
        const sortedStatusesNameInUse = statusesNameInUse.sort((a, b) => a.localeCompare(b)) 
        const uniq = [...new Set(sortedStatusesNameInUse)];
       setStatusTitles(uniq)
        //["", "Done", "To do"]
        let tablestatuses = {}
        uniq.map(title=>
            tablestatuses[`${title}`]={
                num:sortedList.filter(status=>status.name===title).length,
                color:sortedList.filter(status=>status.name===title)[0].color
            }
        )
        setAllTablestatuses(tablestatuses)
        // setAllTablestatuses([...sortedList])
    }, [table,table.tasks])    

     useEffect(() => {
        setTableCopy(table)
    }, [table])    
    
    useEffect(() => {
        setExpandTable(!isShrink)
    }, [isShrink])    
    
    useEffect(() => {
        onShrink(isDragging)
    }, [isDragging,onShrink]) 

    const toggleExpandeTable=(value)=>{
        setExpandTable(value)
    }

    const handleChange=(ev)=>{
        setNewTaskName(ev.target.value)
    }
    const onShowBtn=(ev)=>{
        setIsInputBtnVisable(true)
    }   
    const onHideBtn=()=>{
        setIsInputBtnVisable(false)
        cleanInput()
    }
    const cleanInput=()=>{
        setNewTaskName('')
    }
    
    const addNewTaskKeyUp=(ev,currTable,newTaskName)=>{
        if (ev.keyCode === 13) {
            ev.preventDefault();
            const desc = `added new task "${newTaskName}" to group "${currTable.name}"`
            onAddNewTask(currTable,newTaskName,desc)
            setNewTaskName('')
        }
    }

    const onRemoveTable=(tableId,boardName)=>{
        removeTable(tableId,boardName)
        setIsShowTableOptionsModal(false)
    }   
    
    const toggleHover=()=>{
        setIsHover(curr=>!curr)
    }     
    const updateTableColor=(color)=>{
        const updatedTable = {
            ...table,
            color
        }
        if (table.color === color) return
        const desc = `changed the group color from "${table.color}" to "${color}"`
        onEditTable(updatedTable,desc)
        setIsOpenTableColorModal(false)
    } 
    const onOpenTableColorModal=()=>{
        setIsOpenTableColorModal(true)
        setIsShowTableOptionsModal(false)
    }
    useEffect(() => {
        if (isOpenTableColorModal) {
            colorModal.current.focus();
          }
    }, [isOpenTableColorModal])
    
    const closeTableColorModal=()=>{
        setIsOpenTableColorModal(false)
    }
    const handleDragEnd=({destination, source})=>{
        if(!destination){
            // "not dropped in droppable"
            return
        }
        if(destination.index===source.index&&destination.draggableId===source.draggableId){
            //"dropped in same place"
            return
        }
        const itemCopy = {...table.tasks[source.index]}
        setTableCopy(prev=>{
            prev = {...prev}
            prev.tasks.splice(source.index,1);
            prev.tasks.splice(destination.index, 0, itemCopy);
            return prev
        })
        const desc = `changed the tasks order inside "${tableCopy.name}" group`
        onEditTable(tableCopy,desc)
    }

    function EditBoard(newColumn,desc) {
        const updatedBoard = {
            ...board,
            tableColumns: [...board.tableColumns,newColumn],
            activities:[
                {
                    desc: desc,
                    userId: loggedInUser._id,
                    createdAt: Date.now()
                },
                ...board.activities]
        }
        onEditBoard(updatedBoard)
    }

    function addColumn(type){
        let newColumn = {}
        let desc=''
        switch (type) {
            case 'People':
                newColumn = {
                    _id:Date.now(),
                    title:'People',
                    type:'People',
                    taskKey:'owner'
                }
                desc = `added new people column`
                EditBoard(newColumn,desc)
                break;
            case 'Status':
                newColumn = {
                    _id:Date.now(),
                    title:'Status',
                    type:'Status',
                    taskKey:'status'
                }
                desc = `added new status column`
                EditBoard(newColumn,desc)
                break;
            case 'Date':
                newColumn = {
                    _id:Date.now(),
                    title:'Date',
                    type:'Date',
                    taskKey:'createdAt'
                }
                desc = `added new date column`
                EditBoard(newColumn,desc)
                break;
            case 'Text':
                newColumn = {
                    _id:Date.now(),
                    title:'Text',
                    type:'Text',
                    taskKey:'text'
                }
                desc = `added new text column`
                EditBoard(newColumn,desc)
                break;
            case 'Numbers':
                newColumn = {
                    _id:Date.now(),
                    title:'Numbers',
                    type:'Numbers',
                    taskKey:'numbers'
                }
                desc = `added new numbers column`
                EditBoard(newColumn,desc)
                break;
            case 'CheckBox':
                newColumn = {
                    _id:Date.now(),
                    title:'Check Box',
                    type:'CheckBox',
                    taskKey:'checkBox'
                }
                desc = `added new checkBox column`
                EditBoard(newColumn,desc)
                break;
            case 'LastUpdated':
                newColumn = {
                    _id:Date.now(),
                    title:'Last Updated',
                    type:'LastUpdated',
                    taskKey:'lastUpdated'
                }
                desc = `added new lastUpdated column`
                EditBoard(newColumn,desc)
                break;
            case 'Timeline':
                newColumn = {
                    _id:Date.now(),
                    title:'Timeline',
                    type:'Timeline',
                    taskKey:'timeline'
                }
                desc = `added new timeline column`
                EditBoard(newColumn,desc)
                break;
            case 'Dropdown':
                newColumn = {
                    _id:Date.now(),
                    title:'Dropdown',
                    type:'Dropdown',
                    taskKey:'dropdown'
                }
                desc = `added new dropdown column`
                EditBoard(newColumn,desc)
                break;
            default:
                break;
        }
        setToggleAddColumnModal(false)
    }

    const getSumColumnContent=(columnName)=>{
        let content = [];
        switch (columnName) {
            case 'status':
                content.push(
                    <div className='table-cell sum-cell sum-cell-content-wrapper'>
                        <div className="sum-status-wrapper">
                            {statusTitles.map((title,idx)=>
                             <span 
                             key={idx} 
                             style={{backgroundColor:`${allTablestatuses[`${title}`].color}`, width:`${allTablestatuses[`${title}`].num/statusesSum*100}%`}}>
                                 <span className="label-text arrow-down status-label">
                                     <span>{title===''?'Empty':title}</span>
                                     <span>{allTablestatuses[`${title}`].num}/{statusesSum}</span>
                                     <span>{Math.round(allTablestatuses[`${title}`].num/statusesSum*100)}%</span>
                                 </span>
                             </span>
                            )}
                        </div>
                    </div>
                ) 
                break;     
            case 'owner':
                content.push(
                    <div className='table-cell sum-cell sum-cell-content-wrapper'>
                        {allOwners.length>0&&
                        <div className="owner-container">
                            <div className="owner-avatar-wrapper">
                                <img src={`${allOwners[0].avatar}`} alt=""/>
                            </div>
                            {
                                allOwners.length>1?
                                <div className="owners-count">
                                    +{allOwners.length-1}
                                </div>:
                                null
                            }
                        </div>
                        }
                    </div>
                ) 
                break;
            default:
                content.push(
                    <div className={`table-cell sum-cell ${getColumnWidth(columnName)}`}></div>
                ) 
                break;
        }
        return content;
    }

    const columnBtnsContent = [
        {
            icon:<GoThreeBars className="icon"/>,
            name:'Status'
        },{
            icon:<BsBoxArrowDown className="icon"/>,
            name:'Dropdown'
        }, {
            icon:<IoTextSharp className="icon"/>,
            name:'Text'
        }, {
            icon:<MdDateRange className="icon"/>,
            name:'Date'
        }, {
            icon:<BsPeopleCircle className="icon"/>,
            name:'People'
        }, {
            icon:<TiSortNumerically className="icon"/>,
            name:'Numbers'
        },{
            icon:<FcTimeline className="icon"/>,
            name:'Timeline'
        },{
            icon:<MdUpdate className="icon"/>,
            name:'LastUpdated'
        },{
            icon:<IoMdCheckboxOutline className="icon"/>,
            name:'CheckBox'
        },{
            icon:<HiHashtag className="icon"/>,
            name:'Tags'
        },
    ]

    const getColumnInUseStyle=(btnName)=>{
        let columnsInUse = []
        board.tableColumns.forEach(column=>
            {for(const property in column) {
                if (property === 'type')
                columnsInUse.push(`${column[property]}`)
            }}
        )
        const uniq = [ ...new Set(columnsInUse) ];
        if(uniq.includes(btnName)){
            return 'column-in-use'
        }
            
    }

    const getColumnBtnContent =(btnIcon,btnName)=>{
        let content  = [ <div onClick={()=>addColumn(`${btnName}`)} 
                            className={getColumnInUseStyle(btnName)} >
                            {btnIcon}
                            <span>{`${
                                btnName==='LastUpdated'?
                                'Last Updated':
                                btnName==='CheckBox'?
                                'Check Box':
                                btnName
                            }`}</span>
                        </div>]
        return content
    }


    if (!table||!board) return <div>Loading....</div>
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
                   { isExpand?<div className="table" key={table._id}>
                    <div 
                        className="title-row-wrapper" 
                    >
                        <div
                            className="options-wrapper"  
                            tabIndex="0" 
                            onBlur={()=>setIsShowTableOptionsModal(false)} 
                        >
                            <div className="title-options-btn" onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                                <div className={`TiArrowSortedDown-wrapper TiArrowSortedDown-title-wrapper ${isShowTableOptionsModal?'active':''}`} 
                                style={isHover?{backgroundColor:`white`,borderColor:`${table.color}`}:{backgroundColor:`${table.color}`}}
                                onClick={()=>setIsShowTableOptionsModal(curr=>!curr)}>
                                    <TiArrowSortedDown className={`TiArrowSortedDown-title ${isShowTableOptionsModal?'active':''}`} style={isHover?{color:`${table.color}`}:{color:`white`}}/>
                                </div>
                            </div>
                            {  
                            isShowTableOptionsModal&&
                                <div className="options-modal title-options-modal">
        
                                    <div  className='modal-btn item-actions-btn'
                                    >
                                        <FaPencilAlt className="icon"/>
                                        <span>Rename Group-erorr</span>
                                    </div>
        
                                    <div  className='modal-btn item-actions-btn'
                                    onClick={onOpenTableColorModal}
                                    >
                                        <BsCircleFill 
                                        className="icon"
                                        style={{color:table.color}}
                                        />
                                        <span>Change Group Color</span>
                                    </div>
        
                                    <div className='delete-btn-wrapper'>
                                        <div className='modal-btn item-actions-btn' onClick={()=>{onRemoveTable(table._id,table.name)}}>
                                            <BsTrashFill className="icon"/>
                                            <span>Delete</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {isOpenTableColorModal&&<div className="table-color-modal" ref={colorModal} tabIndex='0' onBlur={()=>setIsOpenTableColorModal(false)}>
                            <div className="first-section">
                                    <BsCircleFill 
                                        className="group-color"
                                        style={{color:table.color}}
                                    />
                            </div>
                            <div  className="second-section">
                                {colorsPicker.map(color=>
                                    <div className="color" style={{backgroundColor:`${color}`}} onClick={()=>updateTableColor(color)}></div>
                                )}
                            </div>
                        </div>}
                        <div className="table-row title-row">
                            {
                                board.tableColumns.map(tableColumn=>
                                    <TableColumnPreview 
                                        board={board} 
                                        tableColumn={tableColumn} 
                                        table={table} 
                                        IoMdNotifications={IoMdNotifications} 
                                        onEditTable={onEditTable} 
                                        onEditBoard={onEditBoard}
                                        isOpenTableColorModal={isOpenTableColorModal}
                                        closeTableColorModal={closeTableColorModal}
                                        toggleExpandeTable={toggleExpandeTable}
                                        isExpand={isExpand}
                                        dragHandle={dragHandle}
                                        onEditTask={onEditTask} 
                                    />
                                ) 
                            }
                                    <div className="table-cell title-cell"
                                     tabIndex="0"
                                     onBlur={()=>{
                                         setToggleAddColumnModal(false)
                                     }}
                                    >
                                        <HiPlusCircle 
                                        className="add-column-btn"
                                        onClick={()=>{
                                            setToggleAddColumnModal(curr=>!curr)
                                        }}
                                        />
                                        {isShowAddColumnModal&&<div className='modal-default-style new-column-modal'
                                        >
                                           <div className="title">Essentials</div>
                                           <div className='column-types-container'>
                                               {
                                                    columnBtnsContent.slice(0,6).map(content=>
                                                        getColumnBtnContent(content.icon,content.name)
                                                    )
                                               }
                                            </div>

                                            <div className="title">Super Useful</div>

                                            <div className='column-types-container'>
                                                {
                                                    columnBtnsContent.slice(6).map(content=>
                                                        getColumnBtnContent(content.icon,content.name)
                                                    )
                                                }
                                            </div>
                                        </div>}
                                    </div>
                        </div> 
                    </div>
                    {
                        table.tasks.map((task,index)=>
                        task.name.toLowerCase().includes(search.toLowerCase())?
                        <>
                        <Droppable droppableId={`droppable-${index}`} >
                        {(provided,snapshot) => (
                            <div className={`task-droppable-container ${snapshot.isDraggingOver?'droppable':''}`}
                            {...provided.droppableProps} ref={provided.innerRef}
                            >
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <Task 
                                        isDragging={snapshot.isDragging}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        provided={provided}
                                        task={task} 
                                        taskKeys={taskKeys} 
                                        table={table} 
                                        onEditTask={onEditTask} 
                                        onRemoveTask={onRemoveTask}
                                        onEditTable={onEditTable} 
                                        board={board}
                                        onEditBoard={onEditBoard}
                                        openConversationModal={openConversationModal}
                                        unCheckTasks={unCheckTasks}
                                        updateBoard={updateBoard}
                                        />
                                    )}
                                </Draggable>
                                {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                        </>
                        :
                        null
                        )
                    } 
                    <div className="table-row add-row">
                                <div className='table-cell add-cell'>
                                    <div className='decoration-line' style={{backgroundColor:`${table.color}`}}></div>
                                    <input 
                                        type="text" 
                                        placeholder="+ Add" 
                                        className={`add-new-task-input ${table.tasks.length>0?'':'new-table-input'}`}
                                        onChange={(ev)=>handleChange(ev)}
                                        value={newTaskName} 
                                        onKeyUp={(ev)=>{
                                            addNewTaskKeyUp(ev,table,newTaskName)
                                        }}
                                        onFocus={(ev)=>onShowBtn(ev)}
                                        onBlur={(ev)=>onHideBtn(ev)}
                                    />
                                     {isInputBtnVisable&&<div 
                                    className={`add-new-task-btn ${newTaskName.split(' ').join('').length>0?'active':''}`}

                                    onMouseDown ={()=>{
                                        const desc = `added new task "${newTaskName}" to group "${table.name}"`
                                        onAddNewTask(table,newTaskName,desc)
                                    }}
                                >Add</div>}
                                </div>
                                <div className='table-cell add-cell'></div>
                    </div> 
                    <div className="table-row sum-row">
                        {
                            taskKeys.map((taskKey)=>
                                getSumColumnContent(taskKey)
                            )
                        }
                        <div className='table-cell sum-cell'></div>
                    </div> 
                </div>:
                <div className={`table ${!isExpand?'shrink':''}`} key={table._id}>
                    <div className="title-row-wrapper" >
                        <div className="table-cell title-cell" style={{color:`${table.color}` }} >
                        <div 
                    className={`${isOpenTableColorModal?'':'table-name-wrapper'}`}
                    tabIndex='0' 
                    onBlur={()=>
                        {
                        closeTableColorModal()
                        }   
                    }  
                    >

                        <div className="table-actions">
                            {!isExpand?<CgExpand className="expand-btn" onClick={()=>toggleExpandeTable(true)}/>:
                            <AiOutlineShrink className="shrink-btn" onClick={()=>toggleExpandeTable(false)}/> }
                            <div  className="drag-btn"  {...dragHandle.dragHandleProps}>
                            <BiGridVertical/>
                            </div>
                        </div>
                        <span>{table.name}</span>
                    </div>
                        </div>
                    </div>
                </div>
                }
        </DragDropContext>
    )
}

