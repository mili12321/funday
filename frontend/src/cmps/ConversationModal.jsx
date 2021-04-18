import React, { useEffect,useState,useRef } from 'react';
import { TextareaEditor } from "./TextareaEditor";
import { FaQuoteRight,FaBold} from 'react-icons/fa'
import { AiOutlineItalic,AiOutlineBars} from 'react-icons/ai'
import { MdFormatColorText,MdFormatListNumbered} from 'react-icons/md'
import { BsTextLeft,BsTextRight} from 'react-icons/bs'
import { GoMention} from 'react-icons/go'
import { TiAttachment } from 'react-icons/ti'
import { BiSmile } from 'react-icons/bi'
import { AiOutlineLike,AiFillLike } from 'react-icons/ai'
import { RiReplyLine } from 'react-icons/ri'
import { useSelector } from "react-redux";
import moment from 'moment'



function ReplyMsgPreview({replyMsg,getUserById,conversation,currTask,onEditTask,currTable}) {

    const loggedInUser = useSelector(state => state.user.loggedInUser);

    function onUpdateReplyLikes(replyMsg) {
        let updatedTask = {}
        if(replyMsg.likes.users.includes(loggedInUser._id)){
            updatedTask = {
                ...currTask,
                conversations: currTask.conversations.map((_conversation)=>
                    _conversation._id===conversation._id?
                    {
                        ..._conversation,
                        replys:conversation.replys.map(_reply=>
                            _reply._id===replyMsg._id?
                            {
                                ..._reply,
                                likes:{
                                    count:_reply.likes.count-1,
                                    users:_reply.likes.users.filter(userId=>userId!==loggedInUser._id)
                                }
                            }
                            :_reply
                            )}
                        :_conversation)
            }
        }else{
            updatedTask = {
                ...currTask,
                conversations: currTask.conversations.map((_conversation)=>
                    _conversation._id===conversation._id?
                    {
                        ..._conversation,
                        replys:conversation.replys.map(_reply=>
                            _reply._id===replyMsg._id?
                            {
                                ..._reply,
                                likes:{
                                    count:_reply.likes.count+1,
                                    users:[..._reply.likes.users,loggedInUser._id]
                                }
                            }
                            :_reply
                            )}
                        :_conversation)
            }
        }
        const desc = `liked reply "${replyMsg.msg}" on conversation inside task "${currTask.name}"`
            
        onEditTask(currTable,updatedTask,desc)
    }

    return(
        <div className="reply-msg-preview">
            <div className="user-img" style={{backgroundImage:`url(${getUserById(replyMsg.userId).avatar})`}}></div>
            <div className="reply-content-wrapper">
                <div className="reply-msg-txt">
                    <span className="user-name">{getUserById(replyMsg.userId).username}</span>
                    <span>{replyMsg.msg}</span>
                </div>
                <div className="reply-msg-info flex">
                    {
                    replyMsg.likes.users.includes(loggedInUser._id)?
                    <AiFillLike onClick={()=>onUpdateReplyLikes(replyMsg)} className='liked pointer'/>
                    :
                    <AiOutlineLike onClick={()=>onUpdateReplyLikes(replyMsg)} className="pointer"/>
                    }
                    {replyMsg.likes.count>0&&replyMsg.likes.count}
                </div>
            </div>
        </div>
    )
}

function ConversationPreview({onEditTask,currTable,currTask,conversation,getUserById,onUpdateMsgLikes,attachmentBtns}) {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [isReplyActive, setIsReplyActive] = useState(false);
    const [reply, setReply] = useState('');
    const [replyTextareaFocus, setReplyTextareaFocus] = useState(false);

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
            likes:{
                count:0,
                users:[]
            },
            createdAt:new Date().getTime()
        }
        const updatedTask = {
            ...currTask,
            conversations: currTask.conversations.map((_conversation)=>_conversation._id===conversation._id?{..._conversation,replys:[..._conversation.replys,newReplyMsg]}:_conversation)
        }
        const desc = `replied to conversation "${conversation.msg}" inside task "${currTask.name}"`
        onEditTask(currTable,updatedTask,desc)
        setReply('')
        setIsReplyActive(false)
        setReplyTextareaFocus(false)
    }

    return (
        <div className="conversation-wrapper" key={conversation._id}>
            <div className="content-wrapper">
                <div className="sender-details">
                    <div className='sender-img' style={{backgroundImage:`url(${getUserById(conversation.userId).avatar})`}}></div>
                    <div className='sender-name'>{getUserById(conversation.userId).username}</div>
                </div>
                <div className="msg">{conversation.msg}</div>
                <div className="flex">
                    <AiOutlineLike onClick={()=>onUpdateMsgLikes(conversation)} className="pointer"/>
                    {conversation.likes.count>0&&conversation.likes.count}
                </div>
            </div>
            <div className="btns-wrapper">
                <div className="btn-wrapper">
                    <div 
                    className={`like-btn ${ conversation.likes.users.includes(loggedInUser._id)? 'liked':''}`}
                    onClick={()=>onUpdateMsgLikes(conversation)}
                    >
                        {
                            conversation.likes.users.includes(loggedInUser._id)?
                            <AiFillLike/>
                            :
                            <AiOutlineLike/>
                        }
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
            {(conversation.replys.length>0||isReplyActive)&&<div className={`reply-wrapper ${conversation.replys.length>0?'column-reverse':''}`}>
                <div className={`add-reply-textarea ${(!replyTextareaFocus&&conversation.replys.length>0)?'reply-close-textarea':''}`}>
                    <div className="user-img" style={{backgroundImage:`url(${loggedInUser.avatar})`}}></div>
                    <div className="reply-msg-wrapper">
                        <textarea 
                        name="" 
                        id="" 
                        cols="30" 
                        rows={`${!replyTextareaFocus&&conversation.replys.length>0?'1':'4'}`}
                        className={`reply-textarea ${!replyTextareaFocus&&conversation.replys.length>0?'reply-close-textarea':''}`}
                        placeholder={`${!replyTextareaFocus&&conversation.replys.length>0?'Write a reply...':''}`}
                        value={reply}
                        onChange={(e)=>setReply(e.target.value)}
                        onFocus={()=>setReplyTextareaFocus(true)}
                        onBlur={()=>setReplyTextareaFocus(false)}
                        ></textarea>
                        {(replyTextareaFocus||conversation.replys.length<1)&&<div className="attachments-bar">
                            {attachmentBtns.map(btn=>
                                <div className="attachment-btn">
                                    {btn.icon}
                                    <span>{btn.name}</span>
                                </div>
                            )}
                            <div className="add-msg-btn"
                            onMouseDown={()=>onReplyMsg(conversation)}
                            >Reply</div>
                        </div>}
                    </div>
                </div>

                <div className="reply-msgs-list">
                    {
                        conversation.replys.map(replyMsg=>
                            <ReplyMsgPreview 
                            replyMsg={replyMsg}
                            getUserById={getUserById}
                            conversation={conversation}
                            currTask={currTask}
                            onEditTask={onEditTask}
                            currTable={currTable}
                            />
                        )
                    }
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
            likes:{
                count:0,
                users:[]
            },
            replys:[],
            createdAt:new Date().getTime()
        }
        const updatedTask = {
            ...currTask,
            conversations: [...currTask.conversations, newConversation]
        }
        const desc = `added new conversation to task "${updatedTask.name}" inside "${currTable.name}"`
        onEditTask(currTable,updatedTask,desc)
        setMsg('')
    }

    function onUpdateMsgLikes(conversation) {;
        if(conversation.likes.users.includes(loggedInUser._id)){
            const updatedTask = {
                ...currTask,
                conversations: currTask.conversations.map((_conversation)=>
                _conversation._id===conversation._id?
                {
                    ...conversation,
                    likes:{
                        count:conversation.likes.count-1,
                        users:conversation.likes.users.filter(userId=>userId!==loggedInUser._id)
                    }
                }:_conversation)
            }
            const desc = `liked conversation "${conversation.msg}" inside task "${currTask.name}"`
            onEditTask(currTable,updatedTask,desc)
        }else{
            const updatedTask = {
                ...currTask,
                conversations: currTask.conversations.map((_conversation)=>
                _conversation._id===conversation._id?
                {
                    ...conversation,
                    likes:{
                        count:conversation.likes.count+1,
                        users:[...conversation.likes.users,loggedInUser._id]
                    }
                }:_conversation)
            }
            const desc = `liked conversation "${conversation.msg}" inside task "${currTask.name}"`
            onEditTask(currTable,updatedTask,desc)
        }
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
            {
                !currTask?
                <div className="no-task-msg">
                    <div className="msg">Task was deleted...</div>
                    <img className="illustration-img" 
                    src={process.env.PUBLIC_URL + "/assets/img/illustration-red-x-mark.jpg"} alt="" srcset=""/>
                </div>
                :
                <>
                <div className='conversation-modal-title'>
          {currTask&&currTask.name}
          </div>
          <div className='conversation-modal-updates'> 
              Updates {currTask&&currTask.conversations.length>0&&`/ ${currTask.conversations.length}`}
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
                </>
            }
          {/* <div className='conversation-modal-title'>
          {currTask&&currTask.name}
          </div>
          <div className='conversation-modal-updates'> 
              Updates {currTask&&currTask.conversations.length>0&&`/ ${currTask.conversations.length}`}
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
          </div> */}
        </div>
    );
}
