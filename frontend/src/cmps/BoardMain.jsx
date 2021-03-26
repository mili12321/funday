import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { loadWorkspaces, updateWorkspace } from '../store/actions/workspaceActions'
import { getCurrBoard, updateCurrBoard} from '../store/actions/workspaceActions'
import { TablePreview } from "./TablePreview";
import { DragDropContext,Droppable ,Draggable   } from 'react-beautiful-dnd';
import { BiGridVertical } from 'react-icons/bi'

import { IoMdNotifications} from 'react-icons/io'
import { HiPlusCircle } from 'react-icons/hi'
import { BsPlus} from 'react-icons/bs'
import { MdClose} from 'react-icons/md'
import { BsTrash} from 'react-icons/bs'
import { IoArrowForwardCircleOutline} from 'react-icons/io5'
import { HiOutlineDocumentDuplicate} from 'react-icons/hi'

class _BoardMain extends Component {
    // const [isExpand, setExpandTable] = useState(true);
    state={
        board:null,
        isShrink:false,
        unCheckTasks:false
    }

    onShrink=(value)=>{
        this.setState({isShrink:value})
    }
    componentDidMount(){
        this.setState({board:this.props.board})
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

   onRemoveCheckedTasks =()=>{
       let ids = []
       let tables = []
       let removedTasks=[]
       const seen = new Set();
       this.props.checkedTasks.forEach(item=>
            {ids.push(item._id)
            tables.push(item.table)}
        )
        const filteredTables = tables.filter(el => {
            const duplicate = seen.has(el._id);
            seen.add(el._id);
            return !duplicate;
          });
        console.log('ids',ids)
        console.log('tables',tables)
        console.log('filteredTables',filteredTables)
        filteredTables.forEach(table => {
            const newTable = {
                ...table,
                tasks:table.tasks.filter(task=>!ids.includes(task._id))
            }
            // this.props.onEditTable(newTable)
            removedTasks = table.tasks.filter(task=>ids.includes(task._id))
            console.log('removedTasks',removedTasks)
            removedTasks.forEach(task=>{
                const desc = `removed task "${task.name}" from "${table.name}"`
                console.log('desc',desc)
                this.props.onEditTable(newTable,desc)
            })
       });
       this.setState({unCheckTasks:true})
   }


//    onRemoveCheckedTasks =()=>{
//     const ids = []
//     const tables = []
//     this.props.checkedTasks.forEach(item=>
//          {ids.push(item._id)
//          tables.push(item.table)}
//      )
//      console.log('ids',ids)
//      console.log('tables',tables)
//      tables.forEach(table => {
//          const newTable = {
//              ...table,
//              tasks:table.tasks.filter(task=>!ids.includes(task._id))
//          }
//          const removedTasks = table.tasks.filter(task=>ids.includes(task._id))
//          console.log('removedTasks',removedTasks)
//          removedTasks.forEach(task=>{
//              const desc = `removed task "${task.name}" from "${table.name}"`
//              console.log('desc',desc)
//              this.props.onEditTable(newTable,desc)
//          })
//          // this.props.onEditTable(newTable,desc)
//     });
//     this.setState({unCheckTasks:true})
// }
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
            search
        } = this.props
        const taskKeys = this.props.board.tableColumns.map(tableColumn=>
                    tableColumn.taskKey
                )
        if (!board) return <div>Loading....</div>
        return (
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
                                         isShrink={this.state.isShrink}
                                         onShrink={this.onShrink}
                                         search={search}
                                         unCheckTasks={this.state.unCheckTasks}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ) 
                    }
                      {provided.placeholder}
                      {this.props.checkedTasks.length>0&&<div className="multiple-actions-modal slide-top">
                          <div className="items-count-wrapper">{this.props.checkedTasks.length}</div>
                          <div>
                                <div className="middle-section">
                                    <div className="selected-items">
                                        <div className="title">Item{`${this.props.checkedTasks.length>1?'s':''}`} selected</div>
                                        <div className="dots-container">
                                            {this.props.checkedTasks.map(task=>
                                                <div className="dot"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="options-wrapper">
                                        <div className="option-btn">
                                            <HiOutlineDocumentDuplicate className="icon"/>
                                            <div className="name">Duplicate</div>
                                        </div>
                                        <div className="option-btn">
                                            <BsTrash className="icon" onClick={this.onRemoveCheckedTasks}/>
                                            <div className="name">Delete</div>
                                        </div>
                                        <div className="option-btn">
                                            <IoArrowForwardCircleOutline className="icon"/>
                                            <div className="name">Move tp</div>
                                        </div>
                                    </div>
                                </div>
                          </div>
                          <div className="close-btn" 
                          onClick={()=>this.setState({unCheckTasks:true})}
                          >
                            <MdClose/>
                          </div>
                        </div>}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
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
