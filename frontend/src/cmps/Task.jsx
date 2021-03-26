import React, { useEffect,useState,useRef } from 'react';
import { FaRegUserCircle,FaPencilAlt } from 'react-icons/fa'
import { TiArrowSortedDown, TiVendorAndroid } from 'react-icons/ti'
import { TaskStatus } from "./TaskStatus";
import { TaskText } from "./TaskText";
import { TaskCheckBox } from "./TaskCheckBox";
import { TaskConversation } from "./TaskConversation";
import { OwnerModal } from "./OwnerModal";
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
    onEditTable,
    onEditTask,
    unCheckTasks
}){
    const users = useSelector(state => state.user.users);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const checkedTasks = useSelector(state => state.workspace.checkedTasks)
    const [currTask, setTask] = useState(task);
    const [isShowOptionsModal, setIsShowOptionsModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOwnerModalShown, setToggleOwnerModal] = useState(false);
    const [isUpdatingText, setUpdatingText] = useState(false);
    const [isChecked, setCheckTask] = useState(false);
    const [getCurrTime, setCurrTime] = useState(null);
    const [owners, setOwners] = useState(task.owner);
    const editableTaskName = useRef()
    const btnEl = useRef()
    const modalEl = useRef(null)
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
    const onOpenModal =()=>{
        // setToggleOwnerModal(true)
        setToggleOwnerModal(curr=>!curr)
        if(modalEl.current){
            modalEl.current.focus()
        }
    }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       console.log('This will run every second!');
    //       tick()
    //     }, 1000);
    //     return () => clearInterval(interval);
    //   }, []);

      useEffect(() => {
        tick()
      }, [task]);

    const tick =()=>{
        console.log("tick")
        let date = moment(task.lastUpdated.date).fromNow()
        if(date==='a few seconds ago'){
            date = 'Just now'
        }
        setCurrTime(date)
    }
    // const getLastUpdatedDate =()=>{
    //     let date = moment(task.lastUpdated.date).fromNow()
    //     if(date==='a few seconds ago'){
    //         date = 'Just now'
    //     }
    //     return date
    // }
    

    const getTaskValue=(taskKey)=>{
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
                    <div className={`add-owner-btn-wrapper ${task[taskKey].length>0?'add-more':'add-first'}`}
                    >
                        <BsPlusCircleFill className={`add-owner ${isOwnerModalShown?'active':''}`}
                        //    onClick={()=>onOpenModal()}
                        /> 
                       { isOwnerModalShown&&
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
                        </div>}
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
                        "Jan 22"
                    )
                }else{
                    var date = new Date(task[taskKey]);
                    var month = date.getMonth()+1;
                    var day = date.getDate();      
                    content.push(
                        <React.Fragment>
                            <span className="month">{getMonthName(month)}</span>
                            <span className="day">{day}</span>
                        </React.Fragment>
                    );
                }
                break;
            case 'text':
                content.push(
                    <TaskText onEditTask={onEditTask} task={task} table={table} setUpdatingText={setUpdatingText}/>
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
                            {/* {getLastUpdatedDate()} */}
                            {getCurrTime}
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
            case 'checkBox':
                return 'checkBox-style'
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

        if (!task) return <div>Loading....</div>
        return (
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
            <div className="table-row task-row" >
                {taskKeys.map((taskKey)=>
                    taskKey==="status"?
                    <TaskStatus taskKey={taskKey} task={task} table={table} FaPencilAlt={FaPencilAlt} onEditTask={onEditTask} board={board} onEditBoard={onEditBoard}/>

                    :
                    <div className={`table-cell task-cell ${getColumnStyle(taskKey)} ${isUpdatingText?'updating-text':''}`}
                    onClick={()=>
                        {if(taskKey!=='owner') return
                        onOpenModal()}}
                    >
                        <div className={`decoration-line task-line ${checkedTasks.length>0?'open':''}`} style={{backgroundColor:`${table.color}`}}>
                            <div className={`task-line-square ${isChecked?'checked':''}`} onClick={()=>setCheckTask(curr=>!curr)}>
                               { isChecked&&<GoCheck style={{color:`${table.color}`}}/>}
                            </div>
                        </div>
                        <div className={`cell-content-wrapper ${taskKey==='name'?'name-wrapper-cell':''}`}
                        >
                            {getTaskValue(taskKey)}
                        </div>
                    </div>
                )}
                <div className='table-cell task-cell'></div>
            </div>
        </div>
        )
}