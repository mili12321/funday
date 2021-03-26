import React, {useState,useRef,useEffect } from 'react';
import { BsThreeDots, BsPencil } from 'react-icons/bs'
import {IoArrowForwardCircleOutline } from 'react-icons/io5'
import { AiOutlineStar } from 'react-icons/ai'
import { VscTrash } from 'react-icons/vsc'
import { useDispatch, useSelector } from "react-redux";
import { updateCurrBoard} from '../store/actions/workspaceActions'
import { WorkspaceList } from './WorkspaceList';
import { AvailableFoldersList } from './AvailableFoldersList';
import { toggleFavUserBoardList } from '../store/actions/userActions'
import { ForwardModal } from "./ForwardModal";
import { updateBoardWorkspace} from '../store/actions/workspaceActions'

export function BoardPreview({
    board,
    onGettingCurrentBoard,
    CgViewComfortable,
    removeBoard,
    editBoard,
    moveBoard,
    moveBoardToFolder,
    object,
    scroll,
    cmp,
    onEditBoard
}) {

    const workspaces = useSelector(state => state.workspace.workspaces)
    const currBoard = useSelector(state => state.workspace.currBoard)
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [dimensions, setDimensions] = useState(null);
    const [currWorkspace, setCurrWorkspace] = useState(null);
    const boardRef = useRef(null)
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
      
    const onGetCurrWorkspace=()=>{
        let theWorkspace = null
        workspaces.forEach(workspace=>
            workspace.boards.forEach(_board=>{ 
                   if(_board._id===board._id){
                    theWorkspace= workspace
                    }
                }
             
            )
        )
        if(!theWorkspace){
            workspaces.forEach(workspace=>
                workspace.folders.forEach(folder=>
                    folder.boards.forEach(_board=>
                        { 
                            if(_board._id===board._id){
                                theWorkspace= workspace
                            }
                        }
                    )
                )
            )
        }
        setCurrWorkspace(theWorkspace)
        dispatch(updateBoardWorkspace(theWorkspace))
    }

    const set = () =>
    setDimensions(boardRef && boardRef.current ? 
        boardRef.current.getBoundingClientRect().bottom>500?
            {...boardRef.current.getBoundingClientRect(),bottom:boardRef.current.getBoundingClientRect().bottom-191}
            : boardRef.current.getBoundingClientRect()
        : {}
    );

    useEffect(() => {
        set();
    }, [scroll]) 

    useEffect(() => {
        setBoardName(board.name)
    }, [board])

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isUpdateName, setIsUpdateName] = useState(false);
    const [boardName, setBoardName] = useState(board.name);
    const [moveToObject, setMoveToObject] = useState(null);
    const inputEl = useRef()

    const [isShownMoveToWorkspaceModal, setIsShownMoveToWorkspaceModal] = useState(false)

    function toggleModal(ev){
        ev.stopPropagation();
        setIsOpenModal(curr=>!curr)
    }

    function handleChangeName(ev) {
        setBoardName(ev.target.value)
    }
    function updateBoardName() {
        const newBoard = {
            ...board,
            name:boardName
        }
        dispatch(updateCurrBoard(newBoard))
        editBoard(newBoard)
    }
    function onMoveBoard(workspace) {
        moveBoard(workspace,board)
        setIsOpenModal(false)
    }
    function onMoveBoardToFolder(workspace,folder) {
        moveBoardToFolder(workspace,folder,board)
        setIsOpenModal(false)
    }
    const onToggleFavUserBoardList=()=>{
        dispatch(toggleFavUserBoardList(loggedInUser,board._id))
        const desc = `${loggedInUser.favBoards.includes(board._id)?'added board to ':'removed board from '}favorites`
        const updatedBoard = {
         ...board,
        activities:[
             {
                 desc: desc,
                 userId: loggedInUser._id,
                 createdAt: Date.now()
             },
             ...board.activities]
        }
        onEditBoard(updatedBoard)
        updateCurrBoard(updatedBoard)
        setIsOpenModal(false)
    }


    useEffect(() => {
        if(!isShownMoveToWorkspaceModal){
            setTimeout(() => {
               if(boardRef&&boardRef.current){
                boardRef.current.focus()
               }
            }, 0);
        }
    }, [isShownMoveToWorkspaceModal])


    const toggleShownForwardModal=(val)=>{
        setIsShownMoveToWorkspaceModal(val)
    }
    if (!board) return <div>Loading...</div>
    return (
    <div
    className={`board-wrapper 
    ${isOpenModal?'open-modal':''} 
    ${isUpdateName?'updating-style':''}
    ${currBoard._id===board._id?'active':''}
    `}
     onClick={()=>
        onGettingCurrentBoard(board)
    }
     tabIndex='0'
     onBlur={()=>{
         setIsOpenModal(isShownMoveToWorkspaceModal)
    }}
     ref={boardRef}
    >
        <div className="name-wrapper">
            <CgViewComfortable className={`icon ${isUpdateName?'updating-style':''}`}/>
            {isUpdateName?
                <input 
                className="update-board-name-input" 
                type="text" 
                value={boardName}
                onChange={handleChangeName}
                ref={inputEl}
                onBlur={()=>{
                    setIsUpdateName(false)
                    updateBoardName()
                }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.target.blur()
                    }
                }}
                />
                :
                <span 
                title={boardName.length>14?boardName:''} 
                className={`${boardName.length>14?'ellipsis-board-name':''}`}
                >
                    {boardName}
                </span>
            }
        </div>
        <BsThreeDots className={`BsThreeDots ${isUpdateName?'hide':''}`} onClick={(ev)=>{
            onGetCurrWorkspace()//for favorite section
            if(boardRef.current.getBoundingClientRect().bottom>500){
                setDimensions({...boardRef.current.getBoundingClientRect(),bottom:boardRef.current.getBoundingClientRect().bottom-191});
            }else if(boardRef.current.getBoundingClientRect().bottom<250){
                if(cmp){
                    setDimensions({...boardRef.current.getBoundingClientRect(),bottom:boardRef.current.getBoundingClientRect().bottom+5+181});
                }else{
                    setDimensions({...boardRef.current.getBoundingClientRect(),bottom:boardRef.current.getBoundingClientRect().bottom+2});
                }
            }else{
                setDimensions(boardRef.current.getBoundingClientRect());
            }
            toggleModal(ev) 
             console.log(boardRef.current.getBoundingClientRect())
            }}/>
        {
        isOpenModal&&
        <div className='modal-default-style item-actions-modal board-modal-wrapper'
        style={{top: `${dimensions?dimensions.bottom-181:0}px`}}
        >
                    <div  className='modal-btn item-actions-btn' onClick={()=>{
                        setIsOpenModal(false)
                        setIsUpdateName(true)
                        setTimeout(() => {
                            inputEl.current.focus()
                        }, 0); 
                    }}>
                        <BsPencil className="icon"/>
                        <span>Rename Board</span>
                    </div>
                    <div className='modal-btn item-actions-btn' onClick={onToggleFavUserBoardList} >
                        <AiOutlineStar className="icon"/>
                       {loggedInUser.favBoards.includes(board._id)? <span>Remove from favorites</span>:
                        <span>Add to favorites</span>}
                    </div>
                    <ForwardModal 
                    btn={<div>
                            <IoArrowForwardCircleOutline className="icon"/>
                            <span>Move To</span>
                        </div>
                    }
                    setMoveToObject={setMoveToObject}
                    isFolderModal={true}
                    toggleShownForwardModal={toggleShownForwardModal}
                    moveToObject={moveToObject}
                    setSearch={setSearch} 
                    >
                        {!moveToObject&&<div className='modal-btn item-actions-btn forward-modal-btn' onClick={()=>{setMoveToObject('Folder')}}>
                            <IoArrowForwardCircleOutline className="icon"/>
                            <span>Move To Folder</span>
                        </div>}
                        {!moveToObject&&<div className='modal-btn item-actions-btn' onClick={()=>{setMoveToObject('Workspace')}}> 
                            <IoArrowForwardCircleOutline className="icon"/>
                            <span>Move To Workspace</span>
                        </div>}
                        { moveToObject&&<div>
                            <div onClick={()=>{setMoveToObject(null)}} className='forward-modal-title'>
                                <div>Choose {moveToObject}</div>
                                <div  className='modal-btn item-actions-btn'>back</div>
                            </div>
                        </div>}
                        {moveToObject==='Workspace'&& <WorkspaceList 
                            onMoveObject={onMoveBoard}
                            object={object}
                            search={search} 
                            setSearch={setSearch} 
                        />}
                        {moveToObject==='Folder'&&<AvailableFoldersList onMoveBoardToFolder={onMoveBoardToFolder}
                        search={search} 
                        setSearch={setSearch} 
                        /> }
                    </ForwardModal>
                    <div className='delete-btn-wrapper'>
                        <div className='modal-btn item-actions-btn' onClick={()=>{
                            removeBoard(board._id)
                            setIsOpenModal(false)
                        }}>
                            <VscTrash className="icon"/>
                            <span>Delete</span>
                        </div>
                    </div>
        </div>}
    </div>
    );
}
