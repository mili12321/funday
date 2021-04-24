import React, { useState,useRef,useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa'
import { SiPandora } from 'react-icons/si';
import { BiCheck } from 'react-icons/bi';
import {colorsPicker } from '../data/shortColorPicker.js';
import {iconsPicker } from '../data/iconsPicker';
import { DynamicFaIcon } from "../data/dynamicFaIcon";

export function CreateWorkspace({setIsShown,addNewWorkspace}) {

    const[newWorkspaceName,setNewWorkspaceName]=useState('New Workspace')
    const[newWorkspaceColor,setNewWorkspaceColor]=useState('#f368e0')
    const[newWorkspaceIcon,setNewWorkspaceIcon]=useState('M')
    const[isOpenModal,setIsOpenModal]=useState(false)

    const inputEl = useRef()
    useEffect(() => {
        setTimeout(() => {
            inputEl.current.focus()
        }, 0); 
    }, [])
    const focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    const handleChangeName =(ev)=>{
        setNewWorkspaceName(ev.target.value)
    }

    return (
    <div className="create-workspace create-item-wrapper"
     >
        <div className="create-item-title">Create Workspace</div>
        <div
            className="workspace-icon"  
            style={{backgroundColor:`${newWorkspaceColor}`}}
            onClick={()=>{setIsOpenModal(true)}}
            tabIndex="0"
            onBlur={()=>{setIsOpenModal(false)}}
            >
           <DynamicFaIcon name={newWorkspaceIcon} />
           {!isOpenModal&&<div className="workspace-icon-edit" >
               <div><FaPencilAlt className="workspace-edit-pencil"/></div>
               <div>Edit</div>
           </div>}
           {isOpenModal&&<div className=" modal-default-style workspace-icon-modal">
                <div className="small-font">Background color</div>
                <div className="workspace-color-picker">
                    {colorsPicker.map(color=>
                        <div className="workspace-color" style={{backgroundColor:`${color}`}}
                         onClick={()=>setNewWorkspaceColor(color)}
                         >
                             {newWorkspaceColor===color&&<BiCheck/>}
                         </div>
                    )}
                </div>
                <div className="small-font">Icon</div>
                <div className="icon-picker">
                    {iconsPicker.map((iconStr,idx)=>
                        <div 
                        key={idx}
                        className="icon"
                        style={{backgroundColor:`${newWorkspaceColor}`}}
                         onClick={()=>setNewWorkspaceIcon(iconStr)}
                         >
                           <DynamicFaIcon name={iconStr} />
                         </div>
                    )}
                </div>
           </div>}
        </div>
        <div className="workspace-name small-font">Workspace name</div>
        <input 
            className="new-item-input"
            type="text" 
            value={newWorkspaceName} 
            onChange={handleChangeName}
            onFocus={focusText}
            ref={inputEl}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                    if(newWorkspaceName.length<1)return
                    addNewWorkspace(newWorkspaceName,newWorkspaceColor,newWorkspaceIcon)
                    setIsShown(false)
                }
            }}
        />
        <div className="btns-container">
            <div className="cancel-btn" onClick={ ()=>{setIsShown(false)} }>Cancel</div>
            <div className='add-btn' onClick={()=>{
            if(newWorkspaceName.length<1)return
            addNewWorkspace(newWorkspaceName,newWorkspaceColor,newWorkspaceIcon)
            setIsShown(false)
            }}>Create Workspace</div>
        </div>
    </div>
    )
}