import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { BiUserCircle } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { VscTrash } from "react-icons/vsc";
import { BsThreeDots } from "react-icons/bs";
import { getTime } from '../data/getTimePass'
import { 
    updateTaskConversation,
    toggleTaskConversationModal,
    updateCurrWorkspace,
    updateCurrBoard
} from '../store/actions/workspaceActions'
import { markAsRead, toggleMarkAsRead, removeNotification, markAllAsRead, removeAllNotifications } from '../store/actions/userActions'

export function NotificationsModal() {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [filteredNotidications, setFilteredNotidications] = useState(loggedInUser.notifications?loggedInUser.notifications:[])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [currView, setCurrView] = useState('Assigned to me')
    const dispatch = useDispatch()

    const headerTitles = [
        'All',
        'Unread',
        'I was mentioned',
        'Assigned to me'
    ]
    const [activeIdx, setActiveIdx] = useState(headerTitles.length-1)

    function onMarkAllAsRead() {
        dispatch(markAllAsRead(loggedInUser))
    }

    function onRemoveAll() {
        dispatch(removeAllNotifications(loggedInUser))
    }

    useEffect(() => {
        const onFilterNotifications = () => {
            switch (currView) {
                case 'Unread':
                    setFilteredNotidications(
                        loggedInUser.notifications.filter(notification=>
                            notification.isRead === false
                        )
                    )
                    break;
                case 'I was mentioned':
                    setFilteredNotidications(
                        loggedInUser.notifications.filter(notification=>
                            notification.section === 'mentioned'
                        )
                    )
                    break;   
                case 'Assigned to me':
                    setFilteredNotidications(
                        loggedInUser.notifications.filter(notification=>
                            notification.section === 'assigned'
                        )
                    )
                    break;                    
                default:
                    setFilteredNotidications(loggedInUser.notifications)
                    break;
            }
    
        }
        onFilterNotifications()
    }, [currView,loggedInUser.notifications])

    
    return (
        <>
            <div className="title-container">
                <div className="modal-title big">Notifications</div>
                <div className="more-options-wrapper" onClick={()=>setIsOpenModal(true)}>
                    <div className={`more-options-btn ${isOpenModal?'active':''}`}
                    onClick={(e)=>{
                        e.stopPropagation()
                        setIsOpenModal(curr=>!curr)
                    }}
                    >
                        <BsThreeDots className="icon BsThreeDots"/>
                    {
                        isOpenModal&&<div className='modal-default-style notifications-option-modal'>
                            <div className="modal-btn" onClick={onMarkAllAsRead}>
                                <IoIosCheckmarkCircleOutline className="icon"/>
                                <span>Mark all as read</span>
                            </div>
                            <div className="modal-btn" onClick={onRemoveAll}>
                                <VscTrash className="icon"/>
                                <span>Delete all</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
                </div>
            <div className="header-navigation notifications-header">
                {headerTitles.map((title,idx)=>
                    <div key={idx} className={`title ${activeIdx===idx?'active':''}`} onClick={()=>{
                        setActiveIdx(idx)
                        setCurrView(title)
                    }}>{title}</div>
                )}
            </div>
            <div className="modal-title">Last 7 Days</div>
            <div className="notification-list">
                {
                    filteredNotidications&&filteredNotidications.length>0?
                    filteredNotidications.map((notification,idx)=>
                    <NotificationPreview notification={notification} idx={idx}/>
                    )
                    :
                    <div>No notifications</div>
                }
            </div>
        </>
    )
}


function NotificationPreview({notification,idx}) {

    const workspaces = useSelector(state => state.workspace.workspaces);
    const users = useSelector(state => state.user.users);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const dispatch = useDispatch()

    function getUserById(userId){
        const user =  users.filter(user=>
        user._id===userId)[0]
        return user
    }

    function onOpenTaskConversation() {
        //update notification isRead:true 
        dispatch(markAsRead(loggedInUser,notification._id))
   
        //open task conversation
        const workspace =workspaces.filter(workspace=>workspace._id===notification.conversationLocation.WorkspaceId)[0]
        if(workspace){
            dispatch( updateCurrWorkspace(workspace) )
            const board = workspace.boards.filter(board=>board._id===notification.conversationLocation.boardId)[0]
            if(board){
                dispatch( updateCurrBoard(board) )
                dispatch(updateTaskConversation(
                    {
                        taskId:notification.conversationLocation.taskId,
                        tableId:notification.conversationLocation.tableId,
                    }
                ))
                dispatch(toggleTaskConversationModal())
            }
        }
    }

    function toggleIsRead() {
        dispatch(toggleMarkAsRead(loggedInUser,notification._id))
    }

    function onRemoveNotification() {
        dispatch(removeNotification(loggedInUser,notification._id))
    }


    return (
        <div key={idx} className={`notification-preview ${!notification.isRead?'unread':''}`} onClick={onOpenTaskConversation}>
            <div className="notification-content-wrapper">
               {notification.from&& <div className="user-img" style={{backgroundImage:`url(${getUserById(notification.from).avatar})`}}></div>}
                <div className="notification-content-wrapper">
                    <div className="header">
                        {notification.from&&<div className="sender-name capitalize">{getUserById(notification.from).username}</div>}
                        <div className='date'>{getTime(notification.createdAt)}</div>
                    </div>
                    <div className="main">
                        <div className="colored-txt"><BiUserCircle className="icon"/><div className="capitalize">{notification.section}</div></div> 
                        <div>{notification.content}</div>
                    </div>
                </div>
            </div>
            <div className="options" onClick={(e)=>e.stopPropagation()}>
                <div className='options-icon-wrapper' onClick={toggleIsRead}>
                    <IoIosCheckmarkCircleOutline className="icon"/>
                    <span class="label-text arrow-up notification">{notification.isRead?'Mark as unread':'Mark as read'}</span>
                </div>
                <div className='options-icon-wrapper' onClick={onRemoveNotification}>
                    <VscTrash className="icon"/>
                    <span class="label-text arrow-up notification">Delete</span>
                </div>
            </div>
        </div>
    )
    
}