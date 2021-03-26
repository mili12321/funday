import React, { useEffect,useState,useRef } from 'react';
import { TextareaEditor } from "./TextareaEditor";
import { FaQuoteRight,FaBold, FaUserEdit} from 'react-icons/fa'
import { AiOutlineItalic,AiOutlineBars} from 'react-icons/ai'
import { MdFormatColorText,MdFormatListNumbered} from 'react-icons/md'
import { BsTextLeft,BsTextRight} from 'react-icons/bs'
import { GoMention} from 'react-icons/go'
import { TiAttachment } from 'react-icons/ti'
import { BiSmile } from 'react-icons/bi'
import { AiOutlineLike } from 'react-icons/ai'
import { RiReplyLine } from 'react-icons/ri'
import { useDispatch, useSelector } from "react-redux";


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
    const [isReplyActive, setReply] = useState(false);
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
        const newConversations={
            _id:Date.now(),
            userId:loggedInUser._id,
            msg:msg,
            likes:0,
            replys:[]
        }
        const updatedTask = {
            ...currTask,
            conversations: [...currTask.conversations, newConversations]
        }
        const desc = `added new conversation to task "${updatedTask.name}" inside "${currTable.name}"`
        onEditTask(currTable,updatedTask,desc)
        setMsg('')
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
                                <div className="conversation-wrapper">
                                    <div className="content-wrapper">
                                        <div className="sender-details">
                                            <div className='sender-img' style={{backgroundImage:`url(${getUserById(conversation.userId).avatar})`}}></div>
                                            <div className='sender-name'>{getUserById(conversation.userId).username}</div>
                                        </div>
                                        <div className="msg">{conversation.msg}</div>
                                    </div>
                                    <div className="btns-wrapper">
                                        <div className="btn-wrapper">
                                            <div className="like-btn">
                                                <AiOutlineLike/>
                                                <span>Like</span>
                                            </div>
                                        </div>
                                        <div className="btn-wrapper">
                                            <div className='reply-btn' onClick={()=>setReply(cur=>!cur)}>
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
                                            ></textarea>
                                            <div className="attachments-bar">
                                                {attachmentBtns.map(btn=>
                                                    <div className="attachment-btn">
                                                        {btn.icon}
                                                        <span>{btn.name}</span>
                                                    </div>
                                                )}
                                                <div className="add-msg-btn"
                                                onClick={onAddMsg}
                                                >Reply</div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
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
