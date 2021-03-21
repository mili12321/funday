import React from 'react';
import { useSelector } from "react-redux";
import { FaRegFolderOpen } from "react-icons/fa";

export function AvailableFoldersList({
    onMoveBoardToFolder,
    search,
    setSearch
}){
    const workspaces = useSelector(state => state.workspace.workspaces);

    return(
        <div>
             <input type="search" placeholder="Search Folder"  className="forward-modal-search-input"
             onChange={(e) => setSearch(e.target.value)}
             />
           {    workspaces.map(workspace=>
                    workspace.folders.map(folder=>
                        folder.name.toLowerCase().includes(search.toLowerCase())?
                        <div 
                            className='modal-btn 
                            item-actions-btn
                            ' 
                            key={folder._id} 
                            onClick={()=>onMoveBoardToFolder(workspace,folder)}
                        >
                            <FaRegFolderOpen className="icon"/>
                            <span>{folder.name}</span>
                        </div>
                        :
                        null
                    )
                )
           }
        </div>
    )
}
