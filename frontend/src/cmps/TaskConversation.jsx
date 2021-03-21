import React, { useEffect,useState,useRef } from 'react';
import {  IoChatbubbleOutline, } from 'react-icons/io5'
import { updateTaskConversation } from '../store/actions/workspaceActions'
import { useDispatch, useSelector } from "react-redux";

export function TaskConversation({openConversationModal,task,table}) {
    const [conversations,setConversations] = useState(task.conversations)
    const dispatch = useDispatch();

    useEffect(() => {
        setConversations(task.conversations)
    }, [task])

    return (
        <>
            <div className='task-conversation-wrapper'>
                <IoChatbubbleOutline className="conversation-bubble" 
                onClick={()=>{
                    dispatch(updateTaskConversation(
                        {
                            taskId:task._id,
                            tableId:table._id
                        }
                    ))
                    openConversationModal()
                }}
                 />
                {conversations.length>0&&<div className="conversations-count">
                    {conversations.length}
                 </div>}
                <span className="label-text arrow-down">Start conversation</span>
            </div>
        </>
    );
}
