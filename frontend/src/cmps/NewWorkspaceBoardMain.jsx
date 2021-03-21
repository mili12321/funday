import React, { useState,useRef,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FaPencilAlt } from 'react-icons/fa'
import { BiCheck } from 'react-icons/bi';
import { BsThreeDots,BsTrashFill } from 'react-icons/bs';
import { WorkspaceIconPicker } from "./WorkspaceIconPicker";

export function NewWorkspaceBoardMain({updateWorkspace,deleteWorkspace}) {
    const workspace = useSelector(state => state.workspace.currWorkspace);
    const[isOpenModal,setIsOpenModal]=useState(false)
    const[isShowModal,setIsShowModal]=useState(false)
    const[newWorkspaceColor,setNewWorkspaceColor]=useState(workspace.color)
    const[newWorkspaceIcon,setNewWorkspaceIcon]=useState(workspace.img)
    const [isUpdateName, setIsUpdateName] = useState(false);
    const [workspaceName, setWorkspaceName] = useState(workspace.name);
    const [isUpdateDesc, setIsUpdateDesc] = useState(false);
    const [workspaceDesc, setWorkspaceDesc] = useState(workspace.desc);
    const nameInputEl = useRef()
    const descInputEl = useRef()

    useEffect(() => {
        setNewWorkspaceColor(workspace.color)
        setNewWorkspaceIcon(workspace.img)
        setWorkspaceName(workspace.name)
        setWorkspaceDesc(workspace.desc)
    }, [workspace])

    function handleChangeName(ev) {
        // if(ev.target.value.length<1)return
        setWorkspaceName(ev.target.value)
    }    
    function onUpdateName() {
        setIsUpdateName(true)
        setTimeout(() => {
            nameInputEl.current.focus()
            nameInputEl.current.select()
        }, 0); 
    }

    function handleChangDesc(ev) {
        setWorkspaceDesc(ev.target.value)
    }
    function onUpdateDesc() {
        setIsUpdateDesc(true)
        setTimeout(() => {
            descInputEl.current.focus()
            descInputEl.current.select()
        }, 0); 
    }
    return (
        <div className="new-workspace-board-main-wrapper">
            <div
                className="workspace-icon"  
                style={{backgroundColor:`${newWorkspaceColor}`}}
                onClick={()=>{setIsOpenModal(true)}}
                tabIndex="0"
                onBlur={()=>{
                    if(newWorkspaceColor!==workspace.color||newWorkspaceIcon!==workspace.img){
                        const newWorkspace={
                            ...workspace,
                            img:newWorkspaceIcon,
                            color:newWorkspaceColor
                        }
                        updateWorkspace(newWorkspace)
                    }
                    setIsOpenModal(false)
                }}
            >
                {newWorkspaceIcon}
                {!isOpenModal&&
                    <div className="workspace-icon-edit" >
                        <div><FaPencilAlt className="workspace-edit-pencil"/></div>
                        <div>Edit</div>
                    </div>
                }
                {isOpenModal&&
                    <div className=" modal-default-style workspace-icon-modal">
                        <WorkspaceIconPicker updateWorkspace={updateWorkspace}/>
                    </div>
                }
            </div>
            <div className="content-wrapper">
                <div className="workspace-name-container">
                    <div
                        className={`name-wrapper  ${isUpdateName?'updating':''}`} onClick={onUpdateName}>
                        {isUpdateName?
                        <input 
                            className="update-workspace-input" 
                            type="text" 
                            value={workspaceName}
                            onChange={handleChangeName}
                            ref={nameInputEl}
                            onBlur={()=>{
                                setIsUpdateName(false)
                                if(workspaceName!==workspace.name){
                                    const newWorkspace={
                                        ...workspace,
                                        name:workspaceName,
                                    }
                                    updateWorkspace(newWorkspace)
                                }
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                }
                            }}
                        />
                        :
                        <div>{workspaceName}</div>
                        }
                    </div>
                        <div className="workspace-options-container"
                        tabIndex="0"
                        onBlur={()=>setIsShowModal(false)}
                        >
                            <BsThreeDots className={`workspace-dots ${isShowModal?'open':''}`} onClick={()=>setIsShowModal(curr=>!curr)}/>
                            {isShowModal&&
                                <div className=" modal-default-style workspace-options-modal">
                                    <div className="modal-btn workspace-options-btn"
                                    onClick={()=>
                                        {onUpdateDesc()
                                        setIsShowModal(false)}
                                    }
                                    >
                                        <FaPencilAlt className="icon"/>
                                        <span>Rename workspace</span>
                                    </div>
                                    <div className="modal-btn workspace-options-btn"
                                     onClick={()=>
                                        {
                                            deleteWorkspace(workspace._id)
                                            setIsShowModal(false)
                                        }
                                    }
                                    >
                                        <BsTrashFill className="icon"/>
                                        <span>Delete workspace</span>
                                    </div>
                                </div>}
                        </div>
                </div>

                <div
                    className={`desc-wrapper ${isUpdateDesc?'updating':''}`} onClick={onUpdateDesc}>
                    {isUpdateDesc?
                    <input 
                        className="update-workspace-input" 
                        type="text" 
                        value={workspaceDesc}
                        onChange={handleChangDesc}
                        ref={descInputEl}
                        onBlur={()=>{
                            setIsUpdateDesc(false)
                            if(workspaceDesc!==workspace.desc){
                                const newWorkspace={
                                    ...workspace,
                                    desc:workspaceDesc
                                }
                                updateWorkspace(newWorkspace)
                            }
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                    />
                    :
                    <div>{workspaceDesc}</div>
                    }
                </div>
            </div>
        </div>
    )
}