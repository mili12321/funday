import React, { useState,useRef,useEffect } from 'react';
import { IoMdArrowDropright } from 'react-icons/io'
import {IoArrowForwardCircleOutline } from 'react-icons/io5'
import { BsThreeDots, BsPencil } from 'react-icons/bs'
import { VscTrash } from 'react-icons/vsc'
import { IoIosArrowForward } from 'react-icons/io'
import { BoardList } from "./BoardList";
import { WorkspaceList } from './WorkspaceList';
import { CreateBoard } from "./CreateBoard";
import { PopupModal } from "./PopupModal";
import { ForwardModal } from "./ForwardModal";

export function FolderPreview({
    folder,
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
    index,
    isNewFolderCreated,
    onEndNewFolderUpdating,
    folders
}) {
    const [isFolderOpen, setIsFolderOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenMoveToModal, setIsOpenMoveToModal] = useState(false);
    const [isUpdateName, setIsUpdateName] = useState(false);
    const [folderName, setFolderName] = useState(folder.name);
    const [isShown, setIsShown] = useState(false)
    const inputEl = useRef()

    const [dimensions, setDimensions] = useState(null);
    const folderRef = useRef(null)

    const [isShownMoveToWorkspaceModal, setIsShownMoveToWorkspaceModal] = useState(false)

    const [search, setSearch] = useState("");
    
    const set = () =>
    setDimensions(folderRef && folderRef.current ? 
        folderRef.current.getBoundingClientRect().bottom>500?
            {...folderRef.current.getBoundingClientRect(),bottom:folderRef.current.getBoundingClientRect().bottom-191}
            : folderRef.current.getBoundingClientRect()
        : {}
    );

    useEffect(() => {
        if(index===folders.length-1&&isNewFolderCreated){
            setIsUpdateName(true) 
            setTimeout(() => {
                inputEl.current.focus()
            }, 0);
        }
    }, [index,folders.length,isNewFolderCreated]) 


    useEffect(() => {
        set();
    }, [scroll]) 

    useEffect(() => {
        setFolderName(folder.name)
    }, [folder])
    const onToggleFolder=()=>{
        setIsFolderOpen(current => !current)
    } 
    function toggleModal(ev){
        ev.stopPropagation();
        setIsOpenModal(curr=>!curr)
    }


    function handleChangeName(ev) {
        setFolderName(ev.target.value)
    }
    function updateFolderName() {
        const newFolder = {
            ...folder,
            name:folderName
        }
        updateFolder(newFolder)
    }
    // function onMoveFolder(currWorkspace,workspace) {
    //     moveFolder(currWorkspace,workspace,folder)
    //     setIsOpenModal(false)
    // }
    function onMoveFolder(workspace) {
        moveFolder(workspace,folder)
        setIsOpenModal(false)
    }

    function addNewBoard(boardName) {
        addBoardInFolder(folder,boardName)
    }

    useEffect(() => {
        if(!isShownMoveToWorkspaceModal){
            setTimeout(() => {
               if(folderRef&&folderRef.current){
                folderRef.current.focus()
               }
            }, 0);
        }
    }, [isShownMoveToWorkspaceModal])
    
    const toggleShownForwardModal=(val)=>{
        setIsShownMoveToWorkspaceModal(val)
    }
    

    if (!folder) return <div>Loading...</div>
    return (
        <>
        <div key={folder._id}>
            <div 
                className={`
                folder-wrapper 
                ${isOpenModal?'open-modal':''} 
                ${isUpdateName?'updating-style':''}`}
                tabIndex={!isNewFolderCreated ? 0 : null}
                onBlur={()=>{
                    setIsOpenModal(isShownMoveToWorkspaceModal)
                }}
                ref={folderRef}
            >
               <div 
                onClick={onToggleFolder}
                className="name-wrapper"
                >
                    {isFolderOpen?
                        <IoMdArrowDropdown className={`icon ${isUpdateName?'updating-style':''}`} />:
                        <IoMdArrowDropright className={`icon ${isUpdateName?'updating-style':''}`}  />
                    }
                    {isUpdateName?
                        <input 
                        className="update-folder-name-input" 
                        type="text" 
                        value={folderName}
                        onChange={handleChangeName}
                        ref={inputEl}
                        onBlur={()=>{
                            setIsUpdateName(false)
                            updateFolderName()
                            onEndNewFolderUpdating()
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                        />
                        :
                        <span  
                        title={folderName.length>14?folderName:''} 
                        className={`${folderName.length>14?'ellipsis-folder-name':''}`}
                        >{folderName}</span>
                    }
               </div>
               <BsThreeDots className={`BsThreeDots ${isUpdateName?'hide':''}`}  onClick={(ev)=>{
                   if(folderRef.current.getBoundingClientRect().bottom>500){
                        setDimensions({...folderRef.current.getBoundingClientRect(),bottom:folderRef.current.getBoundingClientRect().bottom-191});
                    }else{
                        setDimensions(folderRef.current.getBoundingClientRect());
                    }
                   toggleModal(ev)
                   }}/>
               {
               isOpenModal&&
               <div className='modal-default-style item-actions-modal folder-modal-wrapper '
               style={{top: `${dimensions?dimensions.bottom-181:0}px`}}
               >
                    <div className='modal-btn item-actions-btn' onClick={()=>{
                        // addBoardInFolder(folder)
                        setIsShown(true)
                        setIsOpenModal(false)
                    }}>
                        <CgViewComfortable className="icon" />
                        <span>Create board in folder</span>
                    </div>
                    <div  className='modal-btn item-actions-btn' onClick={()=>{
                        setIsOpenModal(false)
                        setIsUpdateName(true)
                        setTimeout(() => {
                            inputEl.current.focus()
                        }, 0); 
                    }}>
                        <BsPencil className="icon"/>
                        <span>Rename folder</span>
                    </div>
                    <ForwardModal 
                    btn={<div>
                            <IoArrowForwardCircleOutline className="icon"/>
                            <span>Move To Workspace</span>
                        </div>
                    }
                    toggleShownForwardModal={toggleShownForwardModal}
                    itemList={true}
                    setSearch={setSearch} 
                    >
                        <WorkspaceList 
                        onMoveObject={onMoveFolder}
                        search={search} 
                        setSearch={setSearch} 
                        />
                    </ForwardModal>
                    <div className='delete-btn-wrapper'>
                        <div className='modal-btn item-actions-btn' onClick={()=>{
                            removeFolder(folder._id)
                            setIsOpenModal(false)
                        }}>
                            <VscTrash className="icon"/>
                            <span>Delete folder</span>
                        </div>
                    </div>
                </div>}
            </div>
            {isFolderOpen&&
             <div className='folder-dropdown' key={folder._id}>
             {folder.boards.length>0&&
                <BoardList 
                     boards={folder.boards}
                     onGettingCurrentBoard={onGettingCurrentBoard}
                     CgViewComfortable={CgViewComfortable}
                     removeBoard={removeBoard}
                     editBoard={editBoard}
                     moveBoard={moveBoard}
                     moveBoardToFolder={moveBoardToFolder}
                     object='insideFolder'
                     scroll={scroll}

                />
             }
             </div>
            }
        </div >

        
        {isShown&&<PopupModal setIsShown={setIsShown} >
            <CreateBoard addNewBoard={addNewBoard} setIsShown={setIsShown}/>
        </PopupModal>}
        </>
    );
}
