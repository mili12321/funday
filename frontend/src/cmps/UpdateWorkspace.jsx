import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateUser} from '../store/actions/userActions'
import { BsThreeDots,BsPencil } from 'react-icons/bs'
import { VscPinned,VscTrash } from 'react-icons/vsc'
import {IoSettingsOutline} from 'react-icons/io5'
import {CgArrowsExchangeAlt} from 'react-icons/cg'
import { ForwardModal } from "./ForwardModal";
import { WorkspaceIconPicker } from "./WorkspaceIconPicker";

export function UpdateWorkspace({updateWorkspace,deleteWorkspace,onGettingCurrentWorkspace,onManageWorkspace}){
    const dispatch = useDispatch()
    const loggedInUser = useSelector(state => state.user.loggedInUser);

    const allWorkspaces = useSelector(state => state.workspace.workspaces);
    const [workspaces,setWorkspaces] = useState(allWorkspaces.filter(
        workspace=>loggedInUser.pinnedWorkspaces.includes(workspace._id))
        )

    const workspace = useSelector(state => state.workspace.currWorkspace);
    const[workspaceColor,setWorkspaceColor]=useState(workspace.color)
    const[workspaceIcon,setWorkspaceIcon]=useState(workspace.img)
    const [isUpdateName, setIsUpdateName] = useState(false);
    const [workspaceName, setWorkspaceName] = useState(workspace.name);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const inputEl = useRef()


    
    const [isShownMoveToWorkspaceModal, setIsShownMoveToWorkspaceModal] = useState(false)
    const btnEl = useRef()

    useEffect(() => {
        setWorkspaces(allWorkspaces.filter(
            workspace=>loggedInUser.pinnedWorkspaces.includes(workspace._id))
            )
    }, [loggedInUser,loggedInUser.pinnedWorkspaces,allWorkspaces])

    useEffect(() => {
        setWorkspaceColor(workspace.color)
        setWorkspaceIcon(workspace.img)
        setWorkspaceName(workspace.name)
    }, [workspace])

    function handleChangeName(ev) {
        setWorkspaceName(ev.target.value)
    }

    function unpinWorkspace(workspaceId) {
        const newUser= {
            ...loggedInUser,
            pinnedWorkspaces:loggedInUser.pinnedWorkspaces.filter(id=>id!==workspaceId)
        }
        dispatch(updateUser(newUser))
        workspaces.map(workspace=>
            workspace.boards.map(board=>
                board.isLastSeen===true? 
                    onGettingCurrentWorkspace(workspace)
                    :null
            )   
        )
    }
    
    useEffect(() => {
        if(!isShownMoveToWorkspaceModal){
            // if(btnEl.current){
            //     setTimeout(() => {
            //         btnEl.current.focus()
            //     }, 0);
            // }
            setTimeout(() => {
                if(btnEl&&btnEl.current){
                    btnEl.current.focus()
                }
            }, 0);
        }
    }, [isShownMoveToWorkspaceModal])
    
    const toggleShownForwardModal=(val)=>{
        setIsShownMoveToWorkspaceModal(val)
    }
    return(
    <div className={`workspace-title ${isOpenModal?'open-modal':''}`}>
        <div className="workspace-symbol" style={{backgroundColor:`${workspaceColor}`}}>{workspaceIcon}</div>
       { isUpdateName?
        <input
            type="text"
            className="workspace-name-input"
            value={workspaceName}
            onChange={handleChangeName}
            ref={inputEl}
            onBlur={()=>{
                setIsUpdateName(false)
                const newWorkspace = {
                    ...workspace,
                    name:workspaceName
                }
                if(workspaceName.length>1){
                    updateWorkspace(newWorkspace)
                }else{
                    setWorkspaceName(workspace.name)
                }
            }}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                    ev.target.blur()
                }
            }}
        />
        :
        <div 
        title={workspaceName.length>12?workspaceName:''} 
        className={`workspace-name ${workspaceName.length>12?'ellipsis-board-name':''}`}
        >{workspaceName}</div>
       }
        <div className={`workspace-name-options-btn-wrapper workspace-title-btn ${isOpenModal?'show-btn':''}`}
        tabIndex='0'
        onBlur={()=>setIsOpenModal(false)}
        ref={btnEl}
        >
            <BsThreeDots className="icon BsThreeDots"
            onClick={()=>{
                setIsOpenModal(curr=>!curr)
            }}
            />
           { isOpenModal&&<div className='modal-default-style toolbar-menu-options-modal item-actions-modal'>
                   <div className="modal-btn item-actions-btn"
                    onClick={()=>{
                        setIsUpdateName(true)
                        setTimeout(() => {
                            inputEl.current.focus()
                        }, 0);
                        setIsOpenModal(false)
                    }}
                   >
                       <BsPencil className="icon"/>
                       <span>Rename workspace</span>
                   </div>
                   <ForwardModal 
                    btn={<div>
                           <CgArrowsExchangeAlt className="icon"/>
                            <span>Change icon</span>
                        </div>
                    }
                    toggleShownForwardModal={toggleShownForwardModal}
                    isWorkspaceIconPicker={true}
                    >
                       <WorkspaceIconPicker updateWorkspace={updateWorkspace}/>
                    </ForwardModal>
                   {/* <div className="modal-btn item-actions-btn">
                       <CgArrowsExchangeAlt className="icon"/>
                        <span>Change icon</span>
                   </div> */}
                   <div className="modal-btn item-actions-btn"
                    onClick={()=>{
                        unpinWorkspace(workspace._id)
                        setIsOpenModal(false)
                    }}
                   >
                       <VscPinned className="icon"/>
                       <span>Unpin workspace from menu</span>
                   </div>
                   <div className="modal-btn item-actions-btn"
                   onClick={()=>{
                    onManageWorkspace()
                    setIsOpenModal(false)
                    }}
                   >
                       <IoSettingsOutline className="icon"/>
                       <span>Manage workspace</span>
                   </div>
                   <div className="modal-btn item-actions-btn"
                    onClick={()=>{
                        deleteWorkspace(workspace._id)
                        setIsOpenModal(false)
                    }}
                   >
                       <VscTrash className="icon"/>
                       <span>Delete workspace</span>
                   </div>
            </div>}
        </div>
    </div>
    )
}