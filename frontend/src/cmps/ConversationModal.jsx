import React, { useEffect,useState,useRef } from 'react';
import { TextareaEditor } from "./TextareaEditor";
import { FaQuoteRight,FaBold} from 'react-icons/fa'
import { AiOutlineItalic,AiOutlineBars} from 'react-icons/ai'
import { MdFormatColorText,MdFormatListNumbered} from 'react-icons/md'
import { BsTextLeft,BsTextRight} from 'react-icons/bs'
import { GoMention} from 'react-icons/go'
import { TiAttachment } from 'react-icons/ti'
import { BiSmile } from 'react-icons/bi'
import { AiOutlineLike } from 'react-icons/ai'
import { RiReplyLine } from 'react-icons/ri'
import {  useSelector } from "react-redux";

function ConversationPreview({onEditTask,currTable,currTask,conversation,getUserById,onUpdateMsgLikes,attachmentBtns}) {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [isReplyActive, setIsReplyActive] = useState(false);
    const [reply, setReply] = useState('');

    useEffect(() => {
        if(!isReplyActive){
            setReply('')
        }
    }, [isReplyActive])

    function onReplyMsg(conversation) {
        if(reply.trim().length<1)return
        const newReplyMsg={
            _id:Date.now(),
            userId:loggedInUser._id,
            msg:reply,
            files:[],
            img:'',
            likes:0
        }
        const updatedTask = {
            ...currTask,
            conversations: currTask.conversations.map((_conversation)=>_conversation._id===conversation._id?{..._conversation,replys:[..._conversation.replys,newReplyMsg]}:_conversation)
        }
        const desc = `replied to conversation "${conversation.msg}" inside task "${currTask.name}"`
        onEditTask(currTable,updatedTask,desc)
        setReply('')
        setIsReplyActive(false)
    }


    return (
        <div className="conversation-wrapper" key={conversation._id}>
                                    <div className="content-wrapper">
                                        <div className="sender-details">
                                            <div className='sender-img' style={{backgroundImage:`url(${getUserById(conversation.userId).avatar})`}}></div>
                                            <div className='sender-name'>{getUserById(conversation.userId).username}</div>
                                        </div>
                                        <div className="msg">{conversation.msg}</div>
                                        <div>{conversation.likes}</div>
                                    </div>
                                    <div className="btns-wrapper">
                                        <div className="btn-wrapper">
                                            <div 
                                            className="like-btn"
                                            onClick={()=>onUpdateMsgLikes(conversation)}
                                            >
                                                <AiOutlineLike/>
                                                <span>Like</span>
                                            </div>
                                        </div>
                                        <div className="btn-wrapper">
                                            <div className='reply-btn' onClick={()=>setIsReplyActive(cur=>!cur)}>
                                                <RiReplyLine/>
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                    </div>
                                    {isReplyActive&&<div className="reply-wrapper">
                                        <div className="user-img" style={{backgroundImage:`url(${loggedInUser.avatar})`}}></div>
                                        <div className="reply-msg-wrapper">
                                            <textarea 
                                            name="" 
                                            id="" 
                                            cols="30" 
                                            rows="4"
                                            className="reply-textarea"
                                            value={reply}
                                            onChange={(e)=>setReply(e.target.value)}
                                            ></textarea>
                                            <div className="attachments-bar">
                                                {attachmentBtns.map(btn=>
                                                    <div className="attachment-btn">
                                                        {btn.icon}
                                                        <span>{btn.name}</span>
                                                    </div>
                                                )}
                                                <div className="add-msg-btn"
                                                onClick={()=>onReplyMsg(conversation)}
                                                >Reply</div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
    )
}

export function ConversationModal({
    onEditTask,
    isOpenConversationModal
}) {

    const users = useSelector(state => state.user.users)
    const currBoard = useSelector(state => state.workspace.currBoard)
    const conversationLocation = useSelector(state => state.workspace.conversationLocation)
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [currTable, setCurrTable] = useState(null);
    const [currTask, setCurrTask] = useState(null);
    const [isActiveInput, setActiveInput] = useState(false);
    const [msg, setMsg] = useState('');
    const inuptRef = useRef()

    useEffect(() => {
        if(conversationLocation.tableId){
            setCurrTable( currBoard.tables.filter(table=>
                table._id===conversationLocation.tableId
            )[0])
        }
    }, [conversationLocation.tableId,currBoard])

    useEffect(() => {
        if(conversationLocation.taskId&&currTable){
            setCurrTask(
                currTable.tasks.filter(task=>
                    task._id===conversationLocation.taskId
                )[0]
            )
        }
    }, [conversationLocation.taskId,currTable])


    useEffect(() => {
        if(!isOpenConversationModal){
            setMsg('')
        }
    }, [isOpenConversationModal])


    function getUserById(userId){
        const user =  users.filter(user=>
        user._id===userId)[0]
        return user
    }


    function onAddMsg(){
        if(msg.trim().length<1)return
        const newConversation={
            _id:Date.now(),
            userId:loggedInUser._id,
            msg:msg,
            files:[],
            img:'',
            likes:0,
            replys:[]
        }
        const updatedTask = {
            ...currTask,
            conversations: [...currTask.conversations, newConversation]
        }
        const desc = `added new conversation to task "${updatedTask.name}" inside "${currTable.name}"`
        onEditTask(currTable,updatedTask,desc)
        setMsg('')
    }

    function onUpdateMsgLikes(conversation) {
        const updatedTask = {
            ...currTask,
            conversations: currTask.conversations.map((_conversation)=>_conversation._id===conversation._id?{..._conversation,likes:_conversation.likes+1}:_conversation)
        }
        const desc = `liked conversation "${conversation.msg}" inside task "${currTask.name}"`
        onEditTask(currTable,updatedTask,desc)
    }


    const editorBtns=[
        {
            icon:<FaQuoteRight/>,
            name:'Blockquote'
        },
        {
            icon:<FaBold/>,
            name:'Strong'
        },
        {
            icon:<AiOutlineItalic/>,
            name:'Emphasis <em></em>'
        }, 
        {
            icon:<MdFormatColorText/>,
            name:'Text color'
        },
        {
            icon:<AiOutlineBars/>,
            name:'Bulleted List '
        },
        {
            icon:<MdFormatListNumbered/>,
            name:'Numbered List'
        },
        {
            icon:<BsTextLeft/>,
            name:'Text left'
        },
        {
            icon:<BsTextRight/>,
            name:'Text right'
        }

    ]

    const attachmentBtns= [
        {
            icon:<TiAttachment/>,
            name:'Add files'
        },
        {
            icon:'',
            name:'GIF'
        },
        {
            icon:<BiSmile/>,
            name:'Emoji'
        },
        {
            icon:<GoMention/>,
            name:'Mention'
        }
    ]
    return (
        <div className={`conversation-modal-content`}>
          <div className='conversation-modal-title'>
              Customer Confirms Use Case(s) are Successfully Implemented
          </div>
          <div className='conversation-modal-updates'> 
              Updates
          </div>
          <div className="updates-section-content">
            {isActiveInput?
                <input type="text" placeholder='Write an update...' className="conversation-input" onClick={()=>{
                    setActiveInput(true)
                    setTimeout(() => {
                        if(inuptRef&&inuptRef.current){
                            inuptRef.current.focus()
                        }
                    }, 0);
                }}/>
                :
                <div className="new-msg-container">
                <div className="textarea-editor-wrapper">
                    {/* <TextareaEditor/> */}
                    <div className="buttons-bar">
                        {editorBtns.map(btn=>
                            <div className="editor-btn">
                            {btn.icon}
                                <span className="label-text arrow-up text-editor-label">{btn.name}</span>
                            </div>
                        )}
                    </div>
                    <textarea name="" id="" cols="30" rows="10" ref={inuptRef}
                    onBlur={()=> setActiveInput(false)}
                    value={msg}
                    onChange={(ev)=>setMsg(ev.target.value)}
                    />
                </div>
                <div className="attachments-bar">
                        {attachmentBtns.map(btn=>
                            <div className="attachment-btn">
                                {btn.icon}
                                <span>{btn.name}</span>
                            </div>
                        )}
                        <div className="add-msg-btn"
                        onClick={onAddMsg}
                        >Update</div>
                </div>
                </div>
            }
            {
                <div className='updates-list'>
                    {
                        currTask&&currTask.conversations.length>0?
                            <>
                            {currTask.conversations.map(conversation=>
                                <ConversationPreview
                                key={conversation._id}
                                conversation={conversation}
                                getUserById={getUserById}
                                onUpdateMsgLikes={onUpdateMsgLikes}
                                attachmentBtns={attachmentBtns}
                                onEditTask={onEditTask}
                                currTable={currTable}
                                currTask={currTask}
                                />
                            )}
                            </>
                        :
                            <span className='no-updates'>No updates yet...</span>
                        }
                </div>
            }
          </div>
        </div>
    );
}
