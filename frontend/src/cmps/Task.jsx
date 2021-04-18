import React, { useEffect,useState,useRef } from 'react';
import { FaRegUserCircle,FaPencilAlt } from 'react-icons/fa'
import { TiArrowSortedDown, TiVendorAndroid } from 'react-icons/ti'
import { getColumnWidth } from "./task-cells-width.js";
import { TaskStatus } from "./TaskStatus";
import { TaskText } from "./TaskText";
import { TaskCheckBox } from "./TaskCheckBox";
import { TaskDate } from "./TaskDate";
import { TaskConversation } from "./TaskConversation";
import { OwnerModal } from "./OwnerModal";
import { DropdownModal } from "./DropdownModal";
import { TaskNumbersColumn } from "./TaskNumbersColumn";
import { TaskTimeline } from "./TaskTimeline";
import { BsTrashFill ,BsPlusCircleFill} from 'react-icons/bs'
import { GoCheck} from 'react-icons/go'
import { addCheckedTasks,removeCheckedTasks} from '../store/actions/workspaceActions'
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from '../store/actions/userActions'
import { updateTaskConversation } from '../store/actions/workspaceActions'
import moment from 'moment'


export function Task({
    task,
    taskKeys, 
    table, 
    board,
    onEditBoard,
    provided,
    isDragging,
    openConversationModal,
    isOpenConversationModal,
    onEditTable,
    onEditTask,
    unCheckTasks,
}){
    const users = useSelector(state => state.user.users);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const checkedTasks = useSelector(state => state.workspace.checkedTasks)
    const [currTask, setTask] = useState(task);
    const [isShowOptionsModal, setIsShowOptionsModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOwnerModalShown, setToggleOwnerModal] = useState(false);
    const [isDropdownModalShown, setToggleDropdownModal] = useState(false);
    const [isMouseInside, setIsMouseInside] = useState(false);
    const [isUpdatingText, setUpdatingText] = useState(false);
    const [isUpdatingNumbers, setUpdatingNumbers] = useState(false);
    const [isChecked, setCheckTask] = useState(false);
    const [getCurrTime, setCurrTime] = useState(null);
    const [newInterval, setNewInterval] = useState(0);
    const [owners, setOwners] = useState(task.owner);
    const editableTaskName = useRef()
    const btnEl = useRef()
    const modalEl = useRef(null)
    const dropdownModalEl = useRef(null)
    const dispatch = useDispatch();

    const [modalPosition, setModalPosition] =useState({})
    const [modalName, setCurrModalName] =useState('')
    const cellEl = useRef(null)

    //status
    const [isStatusModalOpen, setIsStatusModalOpen] =useState(false)
    const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] =useState(false)

    const conversationLocation = useSelector(state => state.workspace.conversationLocation)

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
        //sorted by the task.owner order!
        const itemsArray = users.filter(user=>
            task.owner.includes(user._id)
        )
        const itemOrder = [...task.owner]
        const orderedArray = mapOrder(itemsArray, itemOrder, '_id');

        setOwners(orderedArray)
    }, [task,users,loggedInUser])

    useEffect(() => {
        const currCheckedTask = {
            _id:task._id,
            table:table
        }
        if(isChecked){
            dispatch(addCheckedTasks(currCheckedTask))
        }else{
            dispatch(removeCheckedTasks(task._id))
        }
    }, [isChecked,dispatch,task._id,table])

    useEffect(() => {
        if(unCheckTasks){
            setCheckTask(false)
        }
    }, [unCheckTasks])
   

    useEffect(() => {
       setTask(task)
    }, [task]) 
    
    useEffect(() => {
       if(isShowOptionsModal){
       setTimeout(() => {
        btnEl.current.focus()
       }, 0);
       }
    }, [isShowOptionsModal])
    
     
    useEffect(() => {
       if(isUpdating){
        setTask(task)
        editableTaskName.current.focus()
       }
     }, [isUpdating,task])   

    const focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    const handleChangeName = (ev) => {
        setTask({
            ...currTask,
            name: ev.target.value 
        })
    }
    const onOpenModal =(name,e)=>{
        getModalPosition(e)
        setCurrModalName(name)
        if(name==='owner'){
            // setToggleOwnerModal(curr=>!curr)
            setToggleOwnerModal(true)
            // if(modalEl.current){
            //     modalEl.current.focus()
            // }
        }
        if(name==='dropdown'){
            setToggleDropdownModal(true)
            // setToggleDropdownModal(curr=>!curr)
            // if(dropdownModalEl.current){
            //     dropdownModalEl.current.focus()
            // }
        }
        if(name==='status'){
            setIsStatusModalOpen(true)
        }
    }
    const closeModal =()=>{
        setToggleOwnerModal(false)
        setToggleDropdownModal(false)
        closeStatusModal()
    }
    const getModalStyle=()=>{
        switch (true) {
            case modalName==='owner':
                return 'owner-modal';
            case modalName==='dropdown':
                return 'dropdown-modal'; 
            // case modalName==='status':
            //     return 'status-modal-wrapper';
            default:
                break;
        }

    }


    useEffect(() => {
        const interval = setInterval(() => {
        //   console.log('This will run every second!');
          tick()
        }, 1000);
        return () => clearInterval(interval);
      }, [newInterval]);

    useEffect(() => {
        tick()
    }, [])

      useEffect(() => {
        tick()
        setNewInterval(prev=>prev+1)
      }, [task]);

    const tick =()=>{
        let date = moment(task.lastUpdated.date).fromNow()
        if(date==='a few seconds ago'){
            date = 'Just now'
        }
        setCurrTime(date)
    }

    const lastUpdatedUser=(id)=>{
        return users.filter(user=>user._id===id)[0]
    }


    const getModalPosition = (ev) => {
        const translateY = ev.clientY > window.innerHeight / 2 ? '-100%' : '0';
        const translateX = ev.clientX > window.innerWidth / 2 ? '-100%' : '0';

        const divOffsetS = {
            x:ev.nativeEvent.offsetX,
            y:ev.nativeEvent.offsetY,
            width:ev.nativeEvent.offsetWidth
        }

        const divSizes={
            width:cellEl.current?cellEl.current.offsetWidth:0,
            height:cellEl.current?cellEl.current.offsetHeight:0
        }

        const position = { top: ev.clientY, left: ev.clientX, transform: `translate(${translateX}, ${translateY})` };
        setModalPosition(position)
        console.log('ModalPosition123:',position)
        console.log('ev.clientY:',ev.clientY)
        console.log('window.innerHeight:',window.innerHeight)
        console.log('ev.clientX:',ev.clientX)
        console.log('window.innerWidth:',window.innerWidth)
        console.log('divSizes:',divSizes)
        console.log('divOffsetS:',divOffsetS)
    }
    

    const getTaskValue= (taskKey)=>{
        let content = [];
        switch(taskKey) {
            case 'name':
                content.push(
                <React.Fragment>
                    <div className="task-name-wrapper">
                        <span className={`task-name-span ${ isUpdating?'task-name-span-updating':''}`}>
                        { isUpdating?
                            <input 
                            className="task-name"
                            onFocus={focusText}
                            type="text" 
                            name="name" 
                            ref={editableTaskName} 
                            value={currTask[taskKey]} 
                            onChange={handleChangeName}
                            onBlur={() => {
                                if (currTask.name === task.name) return
                                const desc = `changed the task name from ${task.name} to ${currTask.name}`
                                const updatedTask = {
                                    ...task,
                                    name: currTask.name
                                }
                                onEditTask(table,updatedTask,desc)
                                setIsUpdating(false)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                }
                            }}
                            />:
                            <span 
                            onClick={()=>{
                                dispatch(updateTaskConversation(
                                    {
                                        taskId:task._id,
                                        tableId:table._id
                                    }
                                ))
                                openConversationModal()
                            }}
                            >{task[taskKey]}</span>
                        }
                        </span>
                        <FaPencilAlt className="FaPencilAlt" onClick={() => {
                            setIsUpdating(true)
                        }}/>
                    </div>

                    <TaskConversation 
                    table={table}
                    task={task}
                    openConversationModal={openConversationModal}

                    />
                </React.Fragment>
                );
                break; 
            case 'owner':
                content.push(
                    <div className={`add-cell-content-btn-wrapper ${task[taskKey].length>0?'add-more':'add-first'}`}
                    >
                        <BsPlusCircleFill className={`add-owner ${isOwnerModalShown?'active':''}`}
                        //    onClick={()=>onOpenModal()}
                        /> 
                       {/* { isOwnerModalShown&&
                        <div className='modal-default-style owner-modal'
                        ref={modalEl}
                        tabIndex="0"
                        // onClick={()=> modalEl.current.focus()}
                        onBlur={()=>setToggleOwnerModal(false)}
                        >
                            <OwnerModal
                            task={task} 
                            onEditTask={onEditTask} 
                            table={table}
                            setToggleOwnerModal={setToggleOwnerModal}
                            />
                        </div>} */}
                    </div>
                )
                if(task[taskKey].length>0&&owners.length>0){
                    // const owner = task[taskKey][0]
                    content.push(
                        <div className="owner-container">
                            <div className="owner-avatar-wrapper">
                                <img src={`${owners[0].avatar}`} alt=""/>
                            </div>
                            {
                                task[taskKey].length>1?
                                <div className="owners-count">
                                    +{task[taskKey].length-1}
                                </div>:
                                null
                            }
                         </div>
                    )
                }else{
                    content.push(
                        <FaRegUserCircle style={{ width: '30px', height: '30px', color:"rgb(180, 182, 188)" }}/>
                    )
                }
                break;
            case 'createdAt':
                if(!task[taskKey]){
                    content.push(
                        <TaskDate task={task} taskKey={taskKey} onEditTask={onEditTask} table={table}/>
                    )
                }else{   
                    content.push(
                        <React.Fragment>
                            <TaskDate task={task} taskKey={taskKey} onEditTask={onEditTask} table={table}/>
                        </React.Fragment>
                    );
                }
                break;
            case 'text':
                content.push(
                    <TaskText onEditTask={onEditTask} task={task} table={table} setUpdatingText={setUpdatingText}/>
                ) 
                break; 
            case 'numbers':
                content.push(
                    <TaskNumbersColumn onEditTask={onEditTask} task={task} table={table} setUpdatingNumbers={setUpdatingNumbers}/>
                ) 
                break;
            case 'checkBox':
                content.push(
                    <TaskCheckBox onEditTask={onEditTask} task={task} table={table} />
                ) 
                break;
            case 'lastUpdated':
                if(task[taskKey]&&task[taskKey].date){
                    content.push(
                        <div className="last-updated-task-container">
                            <div className="avatar-wrapper">
                                {lastUpdatedUser(task[taskKey].byUser)&&
                                <img 
                                src={`${lastUpdatedUser(task[taskKey].byUser).avatar}`} alt=""/>}
                            </div>
                            <span>{getCurrTime}</span>
                        </div>
                        
                        
                    ) 
                }
                break;
            case 'timeline':
                    content.push(
                        <TaskTimeline task={task} taskKey={taskKey} onEditTask={onEditTask} table={table}/>
                    ) 
                break;
            case 'dropdown':
                    content.push(
                        <div className={`add-cell-content-btn-wrapper dropdown add-first`}
                        >
                            <BsPlusCircleFill className={`add-owner ${isDropdownModalShown?'active':''}`}
                            /> 
                           {/* { isDropdownModalShown&&
                            <div className='modal-default-style dropdown-modal'
                            ref={dropdownModalEl}
                            onMouseEnter = {()=>setIsMouseInside(true)}
                            onMouseLeave = {()=>setIsMouseInside(false)}
                            onBlur={()=>{
                                //need to remove the modal outside task..
                                if(isMouseInside)return
                                setTimeout(() => {
                                    setToggleDropdownModal(false)
                                }, 0);
                            }}
                            >
                                
                                <DropdownModal
                                task={task} 
                                onEditTask={onEditTask} 
                                table={table}
                                setToggleDropdownModal={setToggleDropdownModal}
                                onEditBoard={onEditBoard}
                                />
                                
                            </div>} */}
                        </div>
                    )
                    if(task[taskKey].length>0){
                        // const owner = task[taskKey][0]
                        content.push(
                            <div className="dropdown-container">
                                <div className="labels-container">
                                    {
                                        task[taskKey].length>1?
                                        
                                            task[taskKey].slice(0,2).map(label=>
                                                <div className="label-wrapper"
                                                title={label.name}
                                                >
                                                {
                                                    label.name.length>8?
                                                    <div className="ellipsis-wrapper">{label.name}</div>
                                                    : 
                                                    <>{label.name}</>
                                                }
                                                </div>
                                            )
                                        :
                                        task[taskKey][0]?<div className={`label-wrapper `}>
                                        {
                                            task[taskKey][0].name.length>8?
                                            <div className='ellipsis-wrapper'
                                            title={task[taskKey][0].name}
                                            >{task[taskKey][0].name}</div>
                                            : 
                                            <>{task[taskKey][0].name}</>
                                        }
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                                {
                                    task[taskKey].length>2?
                                    <div className="dropdown-label-count">
                                        +{task[taskKey].length-2}
                                    </div>:
                                    null
                                }
                             </div>
                        )
                    }
                break;
            default:
                content.push(task[taskKey]);
                break;
        }                                
        return content;
    }

    function getMonthName(month){
        switch(month) {
            case 1:
              return 'Jan';
            case 2:
              return 'Feb';
            case 3:
              return 'Mar';
            case 4:
              return 'Apr';
            case 5:
              return 'May';
            case 6:
              return 'June';
            case 7:
              return 'July';
            case 8:
              return 'Aug';
            case 9:
              return 'Sept';
            case 10:
              return 'Oct';
            case 11:
              return 'Nov';
            case 12:
              return 'Dec';
            default:
              return 'foo';
        }
    }

    const getColumnStyle=(val)=>{
        switch (val) {
            case 'text':
                return 'text-style'
            case 'numbers':
                return 'numbers-style'
            case 'checkBox':
                return 'checkBox-style'
            case 'lastUpdated':
                return 'lastUpdated-style'
            case 'dropdown':
                return `dropdown-style ${task.dropdown.length>0?'not-empty':''}`
            case 'timeline':
                return `timeline-style ${task.timeline.from?'not-empty':''}`
            default:
                return ''
        }
    }


    const removeTask=(currTask)=>{
        const newTable = {
            ...table,
            tasks:table.tasks.filter(task=>task._id!==currTask._id)
        }
        const desc = `removed the task "${currTask.name}" from "${table.name}"`
        onEditTable(newTable,desc)
        setIsShowOptionsModal(false)
    }


    const closeStatusModal=()=>{
        if(isEditLabelsModalOpen)return
        setIsStatusModalOpen(false)
        closeEditLabelsModal()
    }

    const toggleStatusModal=()=>{
        setIsStatusModalOpen(prev=>!prev)
    }

    const openEditLabelsModal=()=>{
        setIsEditLabelsModalOpen(true)
    }
    const closeEditLabelsModal=()=>{
        setIsEditLabelsModalOpen(false)
    }

        if (!task) return <div>Loading....</div>
        return (
            <>
 <div className={`table-row-wrapper ${isDragging?'task-dragging':''}`} ref={provided.innerRef} {...provided.draggableProps}  {...provided.dragHandleProps}>
            <div
                className="options-wrapper"  
            >
                <div className={`options-btn ${isShowOptionsModal?'options-btn-visible':''}`} onClick={()=>setIsShowOptionsModal(true)} 
                tabIndex="0"
                ref={btnEl} 
                 onBlur={()=>setIsShowOptionsModal(false)
                }
                >
                    <div className="TiArrowSortedDown-wrapper   TiArrowSortedDown-task-wrapper">
                        <TiArrowSortedDown/>
                    </div>
                    { 
                isShowOptionsModal&&
                    <div className="options-modal task-options-modal" >
                        <div className='modal-btn item-actions-btn' >
                            <FaPencilAlt className="icon"/>
                            <span onClick={() => {
                                setIsUpdating(true)
                                setIsShowOptionsModal(false)
                            }}>Rename Item</span>
                        </div>
                        <div className='delete-btn-wrapper'>
                            <div className='modal-btn item-actions-btn' onClick={()=>removeTask(task)}>
                                <BsTrashFill className="icon"/>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                }
                </div>
            </div>
            <div className={`table-row task-row ${isOpenConversationModal&&task._id===conversationLocation.taskId?'conversation-modal-open':''}`} >
                {taskKeys.map((taskKey)=>
                    taskKey==="status"?
                    <div 
                    className='table-cell task-cell'
                    tabIndex="0" 
                    onBlur={closeStatusModal}
                    // ref = {cellEl}
                    // onClick={(e)=>
                    //     onOpenModal(taskKey,e)
                    // }
                    >
                        <div className='task-cell-status' style={{backgroundColor:`${task.status.color}`}} onClick={toggleStatusModal}>
                            <div className="cell-content-wrapper">
                            {task[taskKey].name}
                            </div>
                        </div>

                        <div className="status-container">
                        {isStatusModalOpen&&<TaskStatus 
                        taskKey={taskKey} 
                        task={task} 
                        table={table} 
                        FaPencilAlt={FaPencilAlt} 
                        onEditTask={onEditTask} 
                        board={board} 
                        onEditBoard={onEditBoard}
                        isStatusModalOpen={isStatusModalOpen}
                        isEditLabelsModalOpen={isEditLabelsModalOpen}
                        openEditLabelsModal={openEditLabelsModal}
                        closeEditLabelsModal={closeEditLabelsModal}
                        setIsStatusModalOpen={setIsStatusModalOpen}
                        />}
                        </div>
                    </div>

                    :
                    <div className={`table-cell task-cell ${getColumnStyle(taskKey)} ${getColumnWidth(taskKey)} ${isUpdatingText?'updating-text':''} ${isUpdatingNumbers?'updating-numbers':''}
                    `}
                    ref = {cellEl}
                    onClick={(e)=>
                        {if(taskKey==='owner'||taskKey==='dropdown'){
                            console.log('open-owner-modal');
                            onOpenModal(taskKey,e)
                        }
                        }}
                    >
                        <div className={`decoration-line task-line ${checkedTasks.length>0?'open':''}`} style={{backgroundColor:`${table.color}`}}>
                            <div className={`task-line-square ${isChecked?'checked':''}`} onClick={()=>setCheckTask(curr=>!curr)}>
                               { isChecked&&<GoCheck style={{color:`${table.color}`}}/>}
                            </div>
                        </div>
                        <div className={`cell-content-wrapper ${taskKey==='name'?'name-wrapper-cell':''}
                        ${taskKey==='dropdown'?'dropdown-wrapper-cell':''}
                        `}
                        >
                            {getTaskValue(taskKey)}
                        </div>
                    </div>
                )}
                <div className='table-cell task-cell'
                ref = {cellEl}
                ></div>
            </div>
        </div>
       

        { (isOwnerModalShown||isDropdownModalShown)&&
        <div className="modal-screen-wrapper" onClick={closeModal}>
            {<div 
            className={`modal-default-style ${getModalStyle()}`}
            style={{...modalPosition}}
            onClick={(ev) => ev.stopPropagation()}>

                {isOwnerModalShown&&<OwnerModal
                task={task} 
                onEditTask={onEditTask} 
                table={table}
                setToggleOwnerModal={setToggleOwnerModal}/>}

                {isDropdownModalShown&&<DropdownModal
                task={task} 
                onEditTask={onEditTask} 
                table={table}
                setToggleDropdownModal={setToggleDropdownModal}
                onEditBoard={onEditBoard}/>}
                
                {/* {isStatusModalOpen&&<TaskStatus 
                task={task} 
                table={table} 
                FaPencilAlt={FaPencilAlt} 
                onEditTask={onEditTask} 
                board={board} 
                onEditBoard={onEditBoard}
                isStatusModalOpen={isStatusModalOpen}
                isEditLabelsModalOpen={isEditLabelsModalOpen}
                openEditLabelsModal={openEditLabelsModal}
                closeEditLabelsModal={closeEditLabelsModal}
                setIsStatusModalOpen={setIsStatusModalOpen}
                />} */}
            </div>}
            {/* {isStatusModalOpen&&
                <div className="status-container modal-default-style" style={{...modalPosition}}>
                    <TaskStatus 
                    task={task} 
                    table={table} 
                    FaPencilAlt={FaPencilAlt} 
                    onEditTask={onEditTask} 
                    board={board} 
                    onEditBoard={onEditBoard}
                    isStatusModalOpen={isStatusModalOpen}
                    isEditLabelsModalOpen={isEditLabelsModalOpen}
                    openEditLabelsModal={openEditLabelsModal}
                    closeEditLabelsModal={closeEditLabelsModal}
                    setIsStatusModalOpen={setIsStatusModalOpen}
                    />
                </div>
            }    */}
        </div>
        }
       </>
    )

}