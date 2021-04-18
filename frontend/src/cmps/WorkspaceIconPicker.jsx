import React, { useState,useEffect } from 'react';
import { useSelector } from "react-redux";
import { BiCheck } from 'react-icons/bi';
import {colorsPicker } from '../data/shortColorPicker.js';
import {iconsPicker } from '../data/iconsPicker';
import { DynamicFaIcon } from "../data/dynamicFaIcon";

export function WorkspaceIconPicker({updateWorkspace}) {

    const workspace = useSelector(state => state.workspace.currWorkspace);
    const[newWorkspaceColor,setNewWorkspaceColor]=useState(workspace.color)
    const[newWorkspaceIcon,setNewWorkspaceIcon]=useState(workspace.img)

    useEffect(() => {
        setNewWorkspaceColor(workspace.color)
        setNewWorkspaceIcon(workspace.img)
    }, [workspace])

    useEffect(() => {
        if(newWorkspaceColor!==workspace.color){
            const newWorkspace={
                ...workspace,
                color:newWorkspaceColor
            }
            updateWorkspace(newWorkspace)
        }
    }, [newWorkspaceColor,updateWorkspace,workspace])

    useEffect(() => {
        if(newWorkspaceIcon!==workspace.img){
            const newWorkspace={
                ...workspace,
                img:newWorkspaceIcon
            }
            updateWorkspace(newWorkspace)
        }
    }, [newWorkspaceIcon,updateWorkspace,workspace])

    return (
    <>
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
                {iconsPicker.map(iconStr=>
                    <div className="icon"
                    style={{backgroundColor:`${newWorkspaceColor}`}}
                    onClick={()=>setNewWorkspaceIcon(iconStr)}
                    >
                       <DynamicFaIcon name={iconStr} />
                     </div>
                )}
        </div>
    </>
    )
}