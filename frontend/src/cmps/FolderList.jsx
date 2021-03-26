import React, { useState,useRef,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FolderPreview } from "./FolderPreview";

export function FolderList({
    folders,
    IoMdArrowDropdown,
    CgViewComfortable,
    onGettingCurrentBoard,
    addBoardInFolder,
    removeFolder,
    updateFolder,
    removeBoard,
    editBoard,
    moveFolder,
    moveBoard,
    moveBoardToFolder,
    scroll,
    isNewFolderCreated,
    onEndNewFolderUpdating,
    onEditBoard
}) {
    // const currWorkspace = useSelector(state => state.workspace.currWorkspace);
 
    if (!folders) return <div>Loading...</div>
    return (
      <>
       {folders.map((folder,index)=>
    
            <FolderPreview 
            folder={folder} 
            folders={folders}
            IoMdArrowDropdown={IoMdArrowDropdown}
            CgViewComfortable={CgViewComfortable}
            onGettingCurrentBoard={onGettingCurrentBoard}
            addBoardInFolder={addBoardInFolder}
            removeFolder={removeFolder}
            updateFolder={updateFolder}
            removeBoard={removeBoard}
            editBoard={editBoard}
            moveFolder={moveFolder}
            moveBoard={moveBoard}
            moveBoardToFolder={moveBoardToFolder}
            scroll={scroll}
            index={index}
            isNewFolderCreated={isNewFolderCreated}
            onEndNewFolderUpdating={onEndNewFolderUpdating}
            onEditBoard={onEditBoard}
            />
       )}
      </>
    );
}
