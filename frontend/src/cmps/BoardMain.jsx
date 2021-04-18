import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { loadWorkspaces, updateWorkspace } from '../store/actions/workspaceActions'
import { updateCurrBoard} from '../store/actions/workspaceActions'
import { TablePreview } from "./TablePreview";
import { DragDropContext,Droppable ,Draggable   } from 'react-beautiful-dnd';
import { IoMdNotifications} from 'react-icons/io'
import { HiPlusCircle } from 'react-icons/hi'
import { BsPlus} from 'react-icons/bs'
import { MultipleActionsModal} from './MultipleActionsModal'

import { socketService } from '../services/socketService'

class _BoardMain extends Component {
    state={
        board:null,
        isShrink:false,
        unCheckTasks:false
    }

    onUnCheckTasks=()=>{
        this.setState({unCheckTasks:true})
    }



    onShrink=(value)=>{
        this.setState({isShrink:value})
    }
    componentDidMount(){
        this.setState({board:this.props.board})
        //setup sockets
        socketService.setup();
        socketService.on('message', (data) => {
          console.log('data',data)
        })
    }

    onTest=()=>{
        socketService.emit('message', {txt:'123',user:'mili'})
    }



    componentDidUpdate(prevProps){
        if(prevProps.board !== this.props.board){
            this.setState({          
                board: this.props.board
            });
        }
        if(prevProps.checkedTasks!==this.props.checkedTasks&&this.props.checkedTasks.length<1){
            this.setState({unCheckTasks:false})
        }
    }
    handleDragEnd=({destination, source})=>{
       if(!destination){
           // "not dropped in droppable"
           return
       }
       if(destination.index===source.index&&destination.draggableId===source.draggableId){
           // "dropped in same place"
           return
       }
        // board.statusLabelList
       const tableCopy = {...this.props.board.tables[source.index]}
       this.setState({ // no previous or latest old state passed 
            board:{
                ...this.state.board
            }
            }, ()=>{
                this.state.board.tables.splice(source.index,1);
                this.state.board.tables.splice(destination.index, 0, tableCopy);
                return this.state.board
        })  
        const desc = `changed groups order`
        this.props.onEditBoard(this.state.board,desc)
   }

    render() {
        const { 
            board,
            getTaskValue,
            removeTable,
            onAddNewTask,
            onEditTask,
            onEditTable,
            onEditBoard,
            onRemoveTask,
            openConversationModal,
            isOpenConversationModal,
            search,
            updateBoard
        } = this.props
        const taskKeys = this.props.board.tableColumns.map(tableColumn=>
                    tableColumn.taskKey
                )
        if (!board) return <div>Loading....</div>
        return (
            <>
             {/* <button onClick={this.onTest}>test sockets</button> */}
        <DragDropContext  onDragEnd={this.handleDragEnd}>
            <Droppable droppableId={board._id} >
                {(provided) => (
                    <div className="board-main" key={board._id} {...provided.droppableProps} ref={provided.innerRef} >
                    {
                        board.tables.map((table,index)=>
                            <Draggable key={table._id} draggableId={table._id} index={index}>
                                {(provided,snapshot) => (
                                     <div className={`table-wrapper ${this.state.isShrink?'shrink':''}`} ref={provided.innerRef} {...provided.draggableProps}>
                                        <TablePreview
                                        isDragging={snapshot.isDragging}
                                         dragHandle={provided}
                                         taskKeys={taskKeys} 
                                         table={table}
                                         getTaskValue={getTaskValue}
                                         IoMdNotifications={IoMdNotifications}
                                         HiPlusCircle={HiPlusCircle}
                                         BsPlus={BsPlus}
                                         onAddNewTask={onAddNewTask}
                                         onEditTask={onEditTask}
                                         onEditTable={onEditTable}
                                         onEditBoard={onEditBoard}
                                         onRemoveTask={onRemoveTask}
                                         removeTable={removeTable}
                                         openConversationModal={openConversationModal}
                                         isOpenConversationModal={isOpenConversationModal}
                                         isShrink={this.state.isShrink}
                                         onShrink={this.onShrink}
                                         search={search}
                                         unCheckTasks={this.state.unCheckTasks}
                                         updateBoard={updateBoard}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ) 
                    }
                      {provided.placeholder}
                      {this.props.checkedTasks.length>0&&
                      <MultipleActionsModal 
                      checkedTasks={this.props.checkedTasks}
                      onUnCheckTasks={this.onUnCheckTasks}
                      onEditBoard={this.props.onEditBoard}
                      />}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        </>
    );
}}
const mapStateToProps = state => {
    return {
        workspaces: state.workspace.workspaces,
        board: state.workspace.currBoard,
        loggedInUser: state.user.loggedInUser,
        checkedTasks: state.workspace.checkedTasks
    }
}
const mapDispatchToProps = {
    loadWorkspaces,
    updateWorkspace,
    updateCurrBoard,
}
export const BoardMain = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoardMain))
