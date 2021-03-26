import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { BsFillStarFill } from 'react-icons/bs'
import { BoardList } from './BoardList'
import { boardService } from '../services/boardService'
import { updateWorkspace,updateCurrWorkspace} from '../store/actions/workspaceActions'

export function FavoriteBoards({
    onGettingCurrentBoard,
    CgViewComfortable,
    scroll,
    onEditBoard
    // removeBoard,
    // editBoard,
    // moveBoard,
    // moveBoardToFolder
}){
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const favBoardsIds = useSelector(state => state.user.loggedInUser.favBoards)
    const workspaces = useSelector(state => state.workspace.workspaces);
    const boardWorkspace = useSelector(state => state.workspace.boardWorkspace);
    const dispatch = useDispatch();
    // const [allBoards, setAllBoards] = useState([]);

    const [workspaceBoards, setWorkspaceBoards] = useState([]);
    const [folderBoards, setFolderBoards] = useState([]);
    
    const [favoriteWorkspaceBoards, setFavoriteWorkspaceBoards] = useState([]);
    const [favoriteFolderBoards, setFavoriteFolderBoards] = useState([]);
    // const [favoriteBoards, setFavoriteBoards] = useState([]);

    const removeBoard=(boardId)=>{
        const newWorkspace = boardService.removeBoard(boardWorkspace, boardId)
        dispatch(updateWorkspace(newWorkspace))
        dispatch(updateCurrWorkspace(newWorkspace))
    }

    //move board to another workspace or move board in folder to the workspace
    const moveBoard=(newWorkspace,cuurBoard)=>{
        if(boardWorkspace._id===newWorkspace._id){
            const updatedWorkspace = boardService.removeBoard(boardWorkspace, cuurBoard._id)
            const newWorkspaceToUpdate={
                ...updatedWorkspace,
                boards:[...updatedWorkspace.boards, cuurBoard]
            }
            dispatch(updateWorkspace(newWorkspaceToUpdate))
            dispatch(updateCurrWorkspace(newWorkspaceToUpdate))
        }else{
            removeBoard(cuurBoard._id)
            const newWorkspaceToUpdate={
                ...newWorkspace,
                boards:[...newWorkspace.boards, cuurBoard]
            }
            dispatch(updateWorkspace(newWorkspaceToUpdate))
            dispatch(updateCurrWorkspace(newWorkspaceToUpdate))
        }
    }
    //move board to another folder
    const moveBoardToFolder=(folderWorkspace,newFolder,cuurBoard)=>{
        const updatedWorkspace = boardService.removeBoard(boardWorkspace, cuurBoard._id)
        dispatch(updateWorkspace(updatedWorkspace))
        dispatch(updateCurrWorkspace(updatedWorkspace))
        const newFolderToUpdate={
            ...newFolder,
            boards:[...newFolder.boards, cuurBoard]
        }
        if(updatedWorkspace._id===folderWorkspace._id){
            const newWorkspace = boardService.updateFolder(updatedWorkspace, newFolderToUpdate)
            dispatch(updateWorkspace(newWorkspace))
            dispatch(updateCurrWorkspace(newWorkspace))
        }else{
            const newWorkspace = boardService.updateFolder(folderWorkspace, newFolderToUpdate)
            dispatch(updateWorkspace(newWorkspace))
            dispatch(updateCurrWorkspace(newWorkspace))
        }
    }  
    

    function editBoard(newBoard){
            let newWorkspace = boardWorkspace
            let boardInsideFolder = {
                isBoardInsideFolder:false,
                cuurFolde:null
            }
            newWorkspace.folders.map(folder=>
                folder.boards.map(board=>
                    board._id === newBoard._id?boardInsideFolder={
                        ...boardInsideFolder,
                        isBoardInsideFolder:true,
                        cuurFolde:folder
                    }
                    :null
                    
            ))
            if(boardInsideFolder.isBoardInsideFolder){
                //board insode folder
                newWorkspace ={
                    ...boardWorkspace, 
                    folders: boardWorkspace.folders.map(folder=>
                        folder._id===boardInsideFolder.cuurFolde._id?
                       {...folder, boards:
                        folder.boards.map(board=>
                            board._id === newBoard._id?
                            newBoard:board
                        )}
                        :folder
                    )
                }
            }else{
                //board insode workspace
                 //replace the currBoard whith the new Board
                newWorkspace.boards = newWorkspace.boards.map(board=>
                    board._id === newBoard._id?newBoard:board
                )
            }
            // send to update updateWorkspace
            dispatch(updateWorkspace(newWorkspace))
            dispatch(updateCurrWorkspace(newWorkspace))
    }
    
    useEffect(() => {
        setWorkspaceBoards([])
        setFolderBoards([])
        if(loggedInUser.favBoards.length>0){
            workspaces.forEach(workspace=>{ 
                setWorkspaceBoards(prevState =>[...prevState,...workspace.boards])
                // setAllBoards(prevState =>[...prevState,...workspace.boards])
                workspace.folders.map(folder=>
                    setFolderBoards(prevState =>[...prevState,...folder.boards])
                    // setAllBoards(prevState =>[...prevState,...folder.boards])
                )}
            )
        }
    }, [loggedInUser,favBoardsIds,workspaces])


    // useEffect(() => {
    //     setFavoriteBoards(allBoards.filter(board=>favBoardsIds.includes(board._id)))
    // }, [allBoards,favBoardsIds])    
    useEffect(() => {
        setFavoriteWorkspaceBoards(workspaceBoards.filter(board=>favBoardsIds.includes(board._id)))
    }, [workspaceBoards,favBoardsIds])       
    useEffect(() => {
        setFavoriteFolderBoards(folderBoards.filter(board=>favBoardsIds.includes(board._id)))
    }, [folderBoards,favBoardsIds])    


    return (
        <div className="favorite-toolbar-menu">
            <div className="title-wrapper">
                <BsFillStarFill className='star'/>
                <div>Favorites</div>
            </div>

            {
                favoriteWorkspaceBoards.length>0||favoriteFolderBoards.length>0?
                <div>
                    {
                        favoriteWorkspaceBoards.length>0&&
                        <BoardList 
                        boards={favoriteWorkspaceBoards}
                        onGettingCurrentBoard={onGettingCurrentBoard}
                        CgViewComfortable={CgViewComfortable}
                        removeBoard={removeBoard}
                        editBoard={editBoard}
                        moveBoard={moveBoard}
                        moveBoardToFolder={moveBoardToFolder}
                        scroll={scroll}
                        cmp='favorite'
                        onEditBoard={onEditBoard}
                    />
                    }
                     {
                        favoriteFolderBoards.length>0&&
                        <BoardList 
                        boards={favoriteFolderBoards}
                        onGettingCurrentBoard={onGettingCurrentBoard}
                        CgViewComfortable={CgViewComfortable}
                        removeBoard={removeBoard}
                        editBoard={editBoard}
                        moveBoard={moveBoard}
                        moveBoardToFolder={moveBoardToFolder}
                        scroll={scroll}
                        object='insideFolder'
                        cmp='favorite'
                        onEditBoard={onEditBoard}
                    />
                    }
                </div>
                :
                <div className="no-favorite-msg">
                    <div>
                        <BsFillStarFill className='star'/>
                    </div>
                    <div>
                        No favorite boards yet
                    </div>
                    <div>
                        'Star' any board so that you can easily access it later
                    </div>
                </div>
            }
        </div>
    )
}