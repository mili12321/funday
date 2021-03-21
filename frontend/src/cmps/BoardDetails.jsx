import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { BoardHeader } from './BoardHeader'
import { BoardMain } from './BoardMain'
import { NewWorkspaceBoardMain } from './NewWorkspaceBoardMain'

export function BoardDetails({
    isNewWorkspaceCreated,
    onAddNewTable,
    onEditBoard,
    getTaskValue,
    removeTable,
    onAddNewTask,
    onEditTask,
    onEditTable,
    onRemoveTask,
    openConversationModal,
    updateWorkspace,
    deleteWorkspace
}){
    const workspace = useSelector(state => state.workspace.currWorkspace);
    const [search, setSearch] = useState("");

    return (
        <div className="board-content-container">
        {
        !isNewWorkspaceCreated?
            <BoardHeader 
                workspace={workspace}
                onAddNewTable={onAddNewTable}
                onEditBoard={onEditBoard}
                setSearch={setSearch} 
            />:
            <div className="new-workspace-board-header"></div>
        }
            {
            !isNewWorkspaceCreated?
                <BoardMain 
                isNewWorkspaceCreated={isNewWorkspaceCreated}
                workspace={workspace} 
                getTaskValue={getTaskValue}
                removeTable={removeTable}
                onAddNewTask={onAddNewTask}
                onEditTask={onEditTask}
                onEditTable={onEditTable}
                onEditBoard={onEditBoard}
                onRemoveTask={onRemoveTask}
                openConversationModal={openConversationModal}
                search={search} 
            />:
            <NewWorkspaceBoardMain 
            updateWorkspace={updateWorkspace}
            deleteWorkspace={deleteWorkspace}
            />
            }
        </div>
    )
}

