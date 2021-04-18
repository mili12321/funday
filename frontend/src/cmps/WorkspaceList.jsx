import React, { useState,useRef,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { PinCheckbox } from "./PinCheckbox";
import { DynamicFaIcon } from "../data/dynamicFaIcon";

export function WorkspaceList({
    onMoveObject,
    object,
    isCheckbox,
    search,
    setSearch
}){

    const workspaces = useSelector(state => state.workspace.workspaces);
    const currWorkspace = useSelector(state => state.workspace.currWorkspace);
    const [listOfWorkspaces, setListOfWorkspaces] = useState(
        object==='insideFolder'?
        workspaces:
        workspaces.filter(workspace=>workspace._id!==currWorkspace._id)
    );
    useEffect(() => {
        object==='insideFolder'||isCheckbox?
        setListOfWorkspaces(workspaces):
        setListOfWorkspaces(
            workspaces.filter(workspace=>workspace._id!==currWorkspace._id)
        )
    }, [currWorkspace,workspaces,object,isCheckbox])
    return(
        <div>
            <input type="search" placeholder="Search Workspace" className="forward-modal-search-input"
            onChange={(e) => setSearch(e.target.value)}
            />
           {    listOfWorkspaces.map(workspace=>
                    workspace.name.toLowerCase().includes(search.toLowerCase())?
                    <div 
                    className={`modal-btn item-actions-btn forward-modal-btn ${isCheckbox?'remove-pointer':''}`}
                    key={workspace._id} 
                    onClick={()=>{
                        if(isCheckbox){
                            return
                        }
                        onMoveObject(workspace)
                    }}
                    >
                        <div>
                            <div 
                            className="workspace-icon" 
                            style={{backgroundColor:workspace.color}}
                            >
                            <DynamicFaIcon name={workspace.img} />
                            </div>
                            <span  className="workspace-name">{workspace.name}</span>
                        </div>
                       {isCheckbox&&
                       <PinCheckbox workspace={workspace}/>
                        }
                        
                    </div>:
                    null
                )
           }
        </div>
    )
}
