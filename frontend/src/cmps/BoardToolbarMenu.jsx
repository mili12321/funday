import React, { useEffect,useState,useRef } from 'react';
import { FolderList } from "./FolderList";
import { BoardList } from "./BoardList";
import { UpdateWorkspace } from "./UpdateWorkspace";
import { ToolbarMenuActionsBtn } from "./ToolbarMenuActionsBtn";
import { Search } from "./Search";
import { FavoriteBoards } from "./FavoriteBoards";

export function BoardToolbarMenu({
    IoIosArrowForward, 
    isToolbarMenuClose, 
    onToggleToolbarMenu, 
    IoIosArrowBack, 
    workspace,
    IoMdArrowDropdown,
    CgViewComfortable,
    onGettingCurrentBoard,
    onGettingCurrentBoardInWorkspace,
    addNewBoard,
    addNewFloder,
    addBoardInFolder,
    removeFolder,
    updateFolder,
    removeBoard,
    editBoard,
    moveFolder,
    moveBoard,
    moveBoardToFolder,
    isNewFolderCreated,
    onEndNewFolderUpdating,
    updateWorkspace,
    deleteWorkspace,
    onGettingCurrentWorkspace,
    onManageWorkspace,
    toolbarActiveBtn,
    onEditBoard
}) {

const [scroll, setScroll] = useState(0)
const [search, setSearch] = useState("");

const [filteredFolders, setFilteredFolders] = useState([]);
const [filteredBoards, setFilteredBoards] = useState([]);

useEffect(() => {
    console.log('scroll',scroll);
}, [scroll])

    if (!workspace.boards|| !workspace.folders) return <div>Loading....</div>
    return (
        <div className={`board-toolbar-menu ${isToolbarMenuClose?'close-toolbar-menu':'open-toolbar-menu'}`}>
            <div className="sticky-wrapper">
            
                <div className={`toggle-toolbar-menu-btn ${isToolbarMenuClose?'open':'close'}`} onClick={onToggleToolbarMenu}>
                    {isToolbarMenuClose? <IoIosArrowForward style={{ width: '15px', height: '15px' }}/>:<IoIosArrowBack style={{ width: '15px', height: '15px' }}/>}
                    {isToolbarMenuClose?<span className="label-text">Open navigation</span>:<span className="label-text">Close navigation</span>}
                </div>
                <div className={`navigation-container ${isToolbarMenuClose?'hide-txt':'show-txt'}`}>
                        {toolbarActiveBtn==='favorite'?
                        <FavoriteBoards
                        onGettingCurrentBoard={onGettingCurrentBoard}
                        CgViewComfortable={CgViewComfortable}
                        removeBoard={removeBoard}
                        editBoard={editBoard}
                        moveBoard={moveBoard}
                        moveBoardToFolder={moveBoardToFolder}
                        scroll={scroll}
                        onEditBoard={onEditBoard}
                        />
                        :
                        <>
                        <div className="nav-first-area">
                            <UpdateWorkspace 
                            updateWorkspace={updateWorkspace}
                            deleteWorkspace={deleteWorkspace}
                            onGettingCurrentWorkspace={onGettingCurrentWorkspace}
                            onManageWorkspace={onManageWorkspace}
                            />
                            <div className="actions-container">
                                    <ToolbarMenuActionsBtn 
                                        btnName={'Add'}
                                        addNewBoard={addNewBoard}
                                        addNewFloder={addNewFloder}
                                    /> 
                                    <ToolbarMenuActionsBtn 
                                        btnName={'Filters'}
                                    />
                                    
                                    <Search  
                                    search={search} 
                                    setSearch={setSearch} 
                                    setFilteredFolders={setFilteredFolders} 
                                    setFilteredBoards={setFilteredBoards} 
                                    />
                            </div>
                        </div>
                        <div className="nav-second-area">
                            <div className={`second-area-wrapper`}>      
                                <div className={`second-area-content`}
                                    onScroll={() => {
                                        console.log('scroll');
                                        setScroll(curr=>curr+1)
                                    }}
                                >
                                    {workspace.folders.length>0&&
                                        <FolderList 
                                            folders={filteredFolders} 
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
                                            isNewFolderCreated={isNewFolderCreated}
                                            onEndNewFolderUpdating={onEndNewFolderUpdating}
                                            onEditBoard={onEditBoard}
        
                                        />
                                    }
                                    { workspace.boards.length>0&&
                                        <BoardList 
                                            boards={filteredBoards}
                                            onGettingCurrentBoard={onGettingCurrentBoard}
                                            CgViewComfortable={CgViewComfortable}
                                            removeBoard={removeBoard}
                                            editBoard={editBoard}
                                            moveBoard={moveBoard}
                                            moveBoardToFolder={moveBoardToFolder}
                                            scroll={scroll}
                                            onEditBoard={onEditBoard}
                                        />
                                    }

                                    { workspace.boards.length<1&&workspace.folders.length<1&&
                                        <div className="empty-workspace">
                                            <div className="small-font">
                                                Workspace is empty
                                            </div>
                                            <div className="small-font">
                                                Create or add boards
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        </>
                        }
                </div>

            </div>  
        </div>
    );
}