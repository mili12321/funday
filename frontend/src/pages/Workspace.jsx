import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BoardToolbar } from '../cmps/BoardToolbar'
import { BoardToolbarMenu } from '../cmps/BoardToolbarMenu'
import { BoardHeader } from '../cmps/BoardHeader'
import { BoardMain } from '../cmps/BoardMain'
import { BoardDetails } from '../cmps/BoardDetails'

import { ConversationModal } from '../cmps/ConversationModal'
import { ActivitiesModal } from '../cmps/ActivitiesModal'
import { NewWorkspaceBoardMain } from '../cmps/NewWorkspaceBoardMain'
import { loadWorkspaces, updateWorkspace,updateCurrWorkspace, addWorkspace,removeWorkspace} from '../store/actions/workspaceActions'
import { getCurrBoard, updateCurrBoard} from '../store/actions/workspaceActions'
import { updateUser} from '../store/actions/userActions'
import { boardService } from '../services/boardService'
import { folderService } from '../services/folderService'
import { 
    BsLightning, 
    BsStar, 
    BsThreeDots, 
    BsFillStarFill, 
    BsPeople, 
    BsFilter,
    BsPlus
} from 'react-icons/bs'
import { 
    IoIosArrowForward, 
    IoIosArrowBack, 
    IoIosArrowDown,
    IoMdArrowDropdown,
    IoMdNotifications
} from 'react-icons/io'

import { HiOutlineSearch } from 'react-icons/hi'
import { SiProbot } from 'react-icons/si'
import { ImTable } from 'react-icons/im'
import { BiUserCircle } from 'react-icons/bi'
import { RiArrowUpDownFill } from 'react-icons/ri'
import { CgViewComfortable } from 'react-icons/cg'
import { HiPlusCircle } from 'react-icons/hi'
import { GrClose } from 'react-icons/gr'
import { workspaceService } from '../services/workspaceService'

export class _Workspace extends Component {
    state={
        isToolbarMenuClose:false,
        workspace:null,
        isFolderOpen:false,
        board:null,
        folder:null,
        task:{},
        isOpenConversationModal:false,
        isOpenActivitiesModal:false,
        isShowModal:false,
        isNewFolderCreated:false,
        isNewWorkspaceCreated:false,
        toolbarActiveBtn:''
    }
    async componentDidMount() {
        await this.props.loadWorkspaces()
        this.editableName = React.createRef();
        // const mainWorkspace = await this.props.workspaces.filter(workspace=>workspace.isMain===true)[0];
        // this.setState({workspace:mainWorkspace})

        await this.props.workspaces.map(workspace=>workspace.boards.map(board=>board.isLastSeen===true? this.setState({board},()=>{
            this.props.history.push(`/boards/${board._id}`)
            this.props.updateCurrBoard(board)
            this.setState({workspace})
            this.props.updateCurrWorkspace(workspace)
        }):null))[0];
    }
    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    onEndNewFolderUpdating=()=>{
        this.setState({ isNewFolderCreated:false})
    }

    onToggleToolbarMenu=()=>{
        this.setState({isToolbarMenuClose:!this.state.isToolbarMenuClose})
    }

    onGettingCurrentWorkspace=(workspace)=>{
        this.setState({workspace},()=>{
            this.props.updateCurrWorkspace(workspace)
            this.setState({isNewWorkspaceCreated:false})
        })
    }

    isBoardInsideFolder = this.props.match.url.split('/').includes('folders')

    // getCurrWorkspace = () =>{
    //     const workspaceId = this.props.match.url.split('/')[2]
    //     const currWorkspace = workspaceService.getById(workspaceId)
    //     return currWorkspace
    // }
    getCurrFolder = () =>{
       const isBoardInsideFolder = this.props.match.url.split('/').includes('folders')
        if(!isBoardInsideFolder)return
        const folderId = this.props.match.url.split('/')[4]
        const currFolder = folderService.getById(this.props.workspaces,folderId)
        return currFolder
    }
    getCurrBoard = () =>{
        const isBoardInsideFolder = this.props.match.url.split('/').includes('folders')
        if(isBoardInsideFolder){
            const folderId = this.props.match.url.split('/')[4]
            const currFolder = folderService.getById(this.props.workspaces,folderId)
            const boardId = this.props.match.params.id
            const currBoard = boardService.getById(this.props.workspaces,boardId,currFolder)
            // return currBoard
            if(currBoard){
                this.setState({board:currBoard},()=>{
                    this.props.history.push(`/boards/${currBoard._id}`)
                })
            }
        }else{
            // const boardId = this.props.match.url.split('/')[4]
            const boardId = this.props.match.params.id
            const folder=null
            const currBoard = boardService.getById(this.props.workspaces,boardId,folder)
            // return currBoard
            if(currBoard){
                this.setState({board:currBoard},()=>{
                    this.props.history.push(`/boards/${currBoard._id}`)
                })
            }
        }
    }

    onToggleFolder=(folder)=>{
        this.setState({isFolderOpen:!this.state.isFolderOpen})
    } 


    onGettingCurrentBoard=async(board)=>{
        this.setState({board},()=>{
            this.props.history.push(`/boards/${board._id}`)
        })
        await this.props.updateCurrBoard(board)
        this.setState({isNewWorkspaceCreated:false})
    }
   

    onEditBoard=(updatedBoard,desc)=>{
        let newBoard={}

        desc?

        newBoard = {
            ...updatedBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...updatedBoard.activities]
        }
        :
        newBoard = {
            ...updatedBoard,
        }

        this.updateBoard(newBoard)
    }

    onAddNewTable=()=>{
        const newBoard = boardService.addTable(this.state.board)
        const desc = `added a new group`
        const updatedBoard = {
            ...newBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...newBoard.activities]
        }
        this.updateBoard(updatedBoard)
    }
 
    onEditTable=(updatedTable,desc)=>{
        const newBoard = boardService.updateTable(this.state.board,updatedTable)
        const updatedBoard = {
            ...newBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...newBoard.activities]
        }
        this.updateBoard(updatedBoard)
    }

    removeTable=(tableId,boardName)=>{
        const desc = `removed group "${boardName}" from "${this.state.board.name}"`
        const newBoard = boardService.removeTable(tableId,this.state.board)
        const updatedBoard = {
            ...newBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...newBoard.activities]
        }
        this.updateBoard(updatedBoard)
    }

    onAddNewTask=(currTable,newTaskName,desc)=>{
        if(!newTaskName.split(' ').join(''))return
        const newBoard = boardService.addTask(currTable,this.state.board,newTaskName,this.props.loggedInUser)
        const updatedBoard = {
            ...newBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...newBoard.activities]
        }
        this.updateBoard(updatedBoard)
    }

    onEditTask=(currTable,currTask,desc)=>{
        const newBoard = boardService.updateTask(currTable,this.state.board,currTask,this.props.loggedInUser)
        const updatedBoard = {
            ...newBoard,
            activities:[
                {
                    desc: desc,
                    userId: this.props.loggedInUser._id,
                    createdAt: Date.now()
                },
                ...newBoard.activities]
        }
        this.updateBoard(updatedBoard)
    }

    onRemoveTask=(taskId,currTable)=>{
        const newBoard = boardService.removeTask(taskId,currTable,this.state.board)
        this.updateBoard(newBoard)
    }

    editBoard=(newBoard)=>{
        this.updateBoard(newBoard)
    }

    updateBoard(newBoard){
        this.setState({board:newBoard},()=>{
            this.props.updateCurrBoard(newBoard)
            let newWorkspace = this.state.workspace
            // let isBoardInsideFolder = newWorkspace.folders.includes(folder=>
            //  folder.boards.includes(board=>
            //      board._id === newBoard._id
            //  ))
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
                    ...this.state.workspace, 
                    folders: this.state.workspace.folders.map(folder=>
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
            this.props.updateCurrWorkspace(newWorkspace)
            this.setState({workspace:newWorkspace},()=>{
                this.props.updateWorkspace(newWorkspace)
            })
        })
    }
//move folder to another workspace
    moveFolder=(newWorkspace,cuurFolder)=>{
        this.removeFolder(cuurFolder._id)
        const newWorkspaceToUpdate={
            ...newWorkspace,
            folders:[...newWorkspace.folders, cuurFolder]
        }
        this.props.updateWorkspace(newWorkspaceToUpdate)
    }
//move board to another workspace or move board in folder to the workspace
    moveBoard=(newWorkspace,cuurBoard)=>{
        if(this.state.workspace._id===newWorkspace._id){
            const updatedWorkspace = boardService.removeBoard(this.state.workspace, cuurBoard._id)
            const newWorkspaceToUpdate={
                ...updatedWorkspace,
                boards:[...updatedWorkspace.boards, cuurBoard]
            }
            this.setState({workspace:newWorkspaceToUpdate},()=>{
                this.props.updateCurrWorkspace(newWorkspaceToUpdate)
            })
            this.props.updateWorkspace(newWorkspaceToUpdate)
        }else{
            this.removeBoard(cuurBoard._id)
            const newWorkspaceToUpdate={
                ...newWorkspace,
                boards:[...newWorkspace.boards, cuurBoard]
            }
            this.props.updateWorkspace(newWorkspaceToUpdate)
        }
    }
//move board to another folder
    moveBoardToFolder=(folderWorkspace,newFolder,cuurBoard)=>{
        const updatedWorkspace = boardService.removeBoard(this.state.workspace, cuurBoard._id)
        this.setState({workspace:updatedWorkspace},()=>{
            this.props.updateWorkspace(updatedWorkspace)
            this.props.updateCurrWorkspace(updatedWorkspace)
        })
        const newFolderToUpdate={
            ...newFolder,
            boards:[...newFolder.boards, cuurBoard]
        }
        if(updatedWorkspace._id===folderWorkspace._id){
            const newWorkspace = boardService.updateFolder(updatedWorkspace, newFolderToUpdate)
            if( newWorkspace._id===this.state.workspace._id){
                this.setState({workspace:newWorkspace},()=>{
                    this.props.updateCurrWorkspace(newWorkspace)
                })
            }
            this.props.updateWorkspace(newWorkspace)
        }else{
            const newWorkspace = boardService.updateFolder(folderWorkspace, newFolderToUpdate)
            if( newWorkspace._id===this.state.workspace._id){
                this.setState({workspace:newWorkspace},()=>{
                    this.props.updateCurrWorkspace(newWorkspace)
                })
            }
            this.props.updateWorkspace(newWorkspace)
        }
    }  
    

    removeBoard=(boardId)=>{
        const newWorkspace = boardService.removeBoard(this.state.workspace, boardId)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)
        })
    }

    addNewBoard=(boardName)=>{
        const newWorkspace = boardService.addBoard(this.state.workspace,boardName)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)
        })
    }

    addNewWorkspace=(workspaceName,workspaceColor,workspaceIcon)=>{
        
        const newWorkspace =   {
            name:workspaceName,
            isMain : false,
            desc : "description about the workspace",
            img : workspaceIcon,
            color : workspaceColor,
            owner:this.state.loggedInUser,//added in backend
            folders : [],
            boards : []
            }   
        const x = this.props.addWorkspace(newWorkspace)
        x.then(workspace=> 
            this.setState({workspace:workspace},()=>{
                this.setState({isNewWorkspaceCreated:true})
                const newUser= {
                    ...this.props.loggedInUser,
                    pinnedWorkspaces:[
                        ...this.props.loggedInUser.pinnedWorkspaces,
                        workspace._id
                    ]
                }
                this.props.updateUser(newUser)
            })
        )
    }

    updateWorkspace=(newWorkspace)=>{
        this.props.updateWorkspace(newWorkspace)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateCurrWorkspace(newWorkspace)
        })
    }  
     
    deleteWorkspace=(workspaceId)=>{
        this.props.removeWorkspace(workspaceId)
        this.props.workspaces.map(workspace=>
            workspace.boards.map(board=>
                board.isLastSeen===true? 
                    this.setState({workspace},()=>{
                        this.props.updateCurrWorkspace(workspace)
                    })
                    :null
            )   
        )
    }

    addBoardInFolder=(currFolder,boardName)=>{
        const newWorkspace = boardService.addBoardInFolder(this.state.workspace,currFolder,boardName)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)
        })
    }
    addNewFloder=()=>{
        const newWorkspace = boardService.addFolder(this.state.workspace)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)
            this.setState({isNewFolderCreated:true})
        })
    }
    
    removeFolder=(folderId)=>{
        const newWorkspace = boardService.removeFolder(this.state.workspace, folderId)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)
        })
    }
    updateFolder=(newFolder)=>{
        const newWorkspace = boardService.updateFolder(this.state.workspace, newFolder)
        this.setState({workspace:newWorkspace},()=>{
            this.props.updateWorkspace(newWorkspace)
            this.props.updateCurrWorkspace(newWorkspace)

        })
    }

    openConversationModal=()=>{
        this.setState({isShowModal:true})
        this.setState({isOpenConversationModal:true})
    }    
    openActivitiesModal=()=>{
        this.setState({isShowModal:true})
        this.setState({isOpenActivitiesModal:true})
    }

    onManageWorkspace=()=>{
        this.setState({isNewWorkspaceCreated:true})
    }
    onSetToolbarMenu=(val)=>{
         this.setState({toolbarActiveBtn:val})
    }

    render() {
        const { workspaces } = this.props
        const { workspace,board ,isNewWorkspaceCreated} = this.state
        if (!workspaces||!board||!workspace) return <div>Loading....</div>
        return (
            <div className="board-page-container">
                <BoardToolbar 
                    BsLightning={BsLightning} 
                    BsStar={BsStar} 
                    BsThreeDots={BsThreeDots}
                    // workspaces={workspaces}
                    onGettingCurrentWorkspace={this.onGettingCurrentWorkspace}
                    addNewWorkspace={this.addNewWorkspace}
                    onSetToolbarMenu={this.onSetToolbarMenu}
                />
                <BoardToolbarMenu 
                    isToolbarMenuClose={this.state.isToolbarMenuClose} 
                    onToggleToolbarMenu={this.onToggleToolbarMenu}
                    IoIosArrowForward={IoIosArrowForward}
                    IoIosArrowBack={IoIosArrowBack}
                    workspace={workspace}
                    onToggleFolder={this.onToggleFolder}
                    isFolderOpen={this.state.isFolderOpen}
                    IoMdArrowDropdown={IoMdArrowDropdown}
                    CgViewComfortable={CgViewComfortable}
                    onGettingCurrentBoard={this.onGettingCurrentBoard}
                    onGettingCurrentBoardInWorkspace={this.onGettingCurrentBoardInWorkspace}
                    addNewBoard={this.addNewBoard}
                    addNewFloder={this.addNewFloder}
                    addBoardInFolder={this.addBoardInFolder}
                    removeFolder={this.removeFolder}
                    updateFolder={this.updateFolder}
                    removeBoard={this.removeBoard}
                    editBoard={this.editBoard}
                    moveFolder={this.moveFolder}
                    moveBoard={this.moveBoard}
                    moveBoardToFolder={this.moveBoardToFolder}
                    isNewFolderCreated={this.state.isNewFolderCreated}
                    onEndNewFolderUpdating={this.onEndNewFolderUpdating}
                    updateWorkspace={this.updateWorkspace}
                    deleteWorkspace={this.deleteWorkspace}
                    onGettingCurrentWorkspace={this.onGettingCurrentWorkspace}
                    onManageWorkspace={this.onManageWorkspace}
                    toolbarActiveBtn={this.state.toolbarActiveBtn}
                    onEditBoard={this.onEditBoard}
                />
                <BoardDetails
                   isNewWorkspaceCreated={isNewWorkspaceCreated}
                   onAddNewTable={this.onAddNewTable}
                   onEditBoard={this.onEditBoard}
                   getTaskValue={this.getTaskValue}
                   removeTable={this.removeTable}
                   onAddNewTask={this.onAddNewTask}
                   onEditTask={this.onEditTask}
                   onEditTable={this.onEditTable}
                   onRemoveTask={this.onRemoveTask}
                   openConversationModal={this.openConversationModal}
                   updateWorkspace={this.updateWorkspace}
                   deleteWorkspace={this.deleteWorkspace}
                   openActivitiesModal={this.openActivitiesModal}
                />
                { 
                <div className={`conversation-modal-wrapper ${this.state.isShowModal?'':'hide'}`}>
                    <div className={`conversation-modal ${this.state.isShowModal?' slide-left':'slide-right'}`}
                    // tabIndex='0' 
                    // onBlur={()=>{
                    // this.setState({isOpenConversationModal:false})}}
                    >
                        <GrClose className='conversation-close-btn' onClick={()=>{
                        this.setState({isShowModal:false},()=>{
                            this.setState({isOpenConversationModal:false})
                            this.setState({isOpenActivitiesModal:false})
                        })
                        }}
                        />
                        {this.state.isOpenActivitiesModal&&<ActivitiesModal/>}
                        {this.state.isOpenConversationModal&&<ConversationModal 
                        isOpenConversationModal={this.state.isOpenConversationModal}
                        onEditTask={this.onEditTask}
                        />}
                    </div>
                </div>
                }
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        workspaces: state.workspace.workspaces,
        workspace: state.workspace.currWorkspace,
        board: state.workspace.currBoard,
        loggedInUser: state.user.loggedInUser,
    }
}
const mapDispatchToProps = {
    loadWorkspaces,
    updateWorkspace,
    updateCurrWorkspace,
    getCurrBoard,
    updateCurrBoard,
    addWorkspace,
    removeWorkspace,
    updateUser
}
export const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace)