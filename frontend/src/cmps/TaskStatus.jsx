import React, { Component } from 'react'
import {BsDroplet} from 'react-icons/bs'
import {StatusLabelPreview} from './StatusLabelPreview'
import {colorsPicker} from '../data/colorPicker'
import { DragDropContext,Droppable ,Draggable   } from 'react-beautiful-dnd';


export class TaskStatus extends Component {
    state={
        statusLabelList:[],
        newLabelColor:null,
        isUpdateLabelColor:false,
        currLabel:{},
        hideColorPicker:false,
        boardCopy:null
    }

    async componentDidMount(){
        const statusLabelList = [...this.props.board.statusLabelList]
        this.setState({statusLabelList})
        this.setState({boardCopy:this.props.board})
    }

    updateTask=(table,task,statusLabel)=>{
        if(task.status.name===statusLabel.name){
            this.props.setIsStatusModalOpen(false)
            return
        }
        const updatedTask = {
            ...task,
            status:statusLabel
        }
        const desc = `changed task "${task.name}" status from "${task.status.name}" to "${statusLabel.name}"`
        this.props.onEditTask(table,updatedTask,desc)
        this.props.setIsStatusModalOpen(false)
    }
    onChangeNewLabelColor=(currColor)=>{
        this.setState({newLabelColor:currColor})
    }
    onRemoveNewLabelColor=()=>{
        this.setState({newLabelColor:null})
    }
    onAddNewLabel=(currColor)=>{
        if(this.props.board.statusLabelList.length===12)return
        this.setState({
            statusLabelList:[
                ...this.props.board.statusLabelList,
                {
                    _id:(new Date()).getTime().toString(),
                    color:currColor,
                    name:'New Label'
                }
            ]
        },()=>{
            const newBoard = {
                ...this.props.board,
                 statusLabelList:[...this.props.board.statusLabelList,{
                    _id:(new Date()).getTime().toString(),
                    color:currColor,
                    name:'New Label'
                }]
            }
            this.props.onEditBoard(newBoard,null)
        })
    }
    onRemoveLabel=(labelId)=>{
        const newstatusLabelList = this.state.statusLabelList.filter(label=>label._id!==labelId)
        this.setState({
            statusLabelList:newstatusLabelList
        },()=>{
            const newBoard = {
                ...this.props.board,
                statusLabelList:newstatusLabelList
            }
            this.props.onEditBoard(newBoard,null)
        })
    }
    updateLabel=(newLabel)=>{
        const newstatusLabelList = this.props.board.statusLabelList.map(label=>label._id===newLabel._id?newLabel:label)
        this.setState({
            statusLabelList:newstatusLabelList
        },()=>{
            const newBoard = {...this.props.board,
                statusLabelList:newstatusLabelList
            }
            this.props.onEditBoard(newBoard,null)
        })
    }
    onToggleUpdateLabelColor=(currLabel)=>{
        this.setState({isUpdateLabelColor:!this.state.isUpdateLabelColor})
        this.setState({currLabel})
    }
    hideColorPicker=(toggleUpdateLabel)=>{
        if(toggleUpdateLabel){
            this.setState({hideColorPicker:true})
        }else{
            this.setState({hideColorPicker:false})
        }
    }
    handleDragEnd=({destination, source})=>{
       if(!destination){
           // console.log("not dropped in droppable")
           return
       }
       if(destination.index===source.index&&destination.draggableId===source.draggableId){
           // console.log("dropped in same place")
           return
       }
        //board.statusLabelList
       const statusLabelListCopy = {...this.props.board.statusLabelList[source.index]}
       this.setState({ // no previous or latest old state passed 
            boardCopy:{...this.state.boardCopy}
            }, ()=>{
                this.state.boardCopy.statusLabelList.splice(source.index,1);
                this.state.boardCopy.statusLabelList.splice(destination.index, 0, statusLabelListCopy);
                return this.state.boardCopy
        })  
        this.props.onEditBoard(this.state.boardCopy,null)
   }
    render() {
        const { task, table, FaPencilAlt, board, isEditLabelsModalOpen, openEditLabelsModal, closeEditLabelsModal} = this.props

        if (!task) return <div>Loading....</div>
        return (
            <div className="status-modal-wrapper">
                {
                    !isEditLabelsModalOpen&&
                    <>
                        <div className="status-label-list-container">
                            {
                            board.statusLabelList.map((statusLabel,idx)=>
                                <div 
                                title={`${statusLabel.name}`}
                                className={`stat-label ${statusLabel.name.length>13?'ellipsis-label-name':''}`}
                                tabindex="0"
                                style={{backgroundColor:`${statusLabel.color}`}}
                                onMouseDown={()=>this.updateTask(table,task,statusLabel)}
                                >
                                   {statusLabel.name}
                                </div> 
                            )}
                        </div>
                        <div className="status-label-btn edit-status" onClick={openEditLabelsModal}>
                            <FaPencilAlt className="status-FaPencilAlt"/>
                            <span>Add/Edit Labels</span>
                        </div>
                    </>
                }{
                 isEditLabelsModalOpen&&
                    <>
                        <DragDropContext  onDragEnd={this.handleDragEnd} >
                            <Droppable droppableId='statusLabelList'>
                            {(provided) => (
                                <div className={`status-label-list-container edit ${this.state.hideColorPicker?'updating-the-label':''}`} key='statusLabelList' {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                    board.statusLabelList.map((statusLabel,index)=>
                                        <Draggable key={statusLabel._id} draggableId={statusLabel._id} index={index}>
                                            {(provided) => (
                                                <StatusLabelPreview 
                                                provided={provided}
                                                BsDroplet={BsDroplet}
                                                TiDelete={BsDroplet}
                                                statusLabel={statusLabel}
                                                colorsPicker={colorsPicker}
                                                hideColorPicker={this.hideColorPicker}
                                                idx={index}
                                                onRemoveLabel={this.onRemoveLabel}
                                                updateLabel={this.updateLabel}
                                                />
                                            )}
                                        </Draggable>
                                    )}
                                    {board.statusLabelList.length<12&&<div className={`add-new-label sec-column ${this.state.newLabelColor?'':'default'}`} style={{backgroundColor:`${this.state.newLabelColor?this.state.newLabelColor:'transparent'}`}}>
                                    New Label
                                    </div>}
                                    {provided.placeholder}
                                </div>
                            )}
                            </Droppable>
                        </DragDropContext>
                       { !this.state.hideColorPicker&&<div className='status-color-picker'>
                            {colorsPicker.map(color=>
                                <div 
                                className="color" 
                                style={{backgroundColor:`${color}`}}
                                onMouseEnter={() => this.onChangeNewLabelColor(color)}
                                onMouseLeave={() => this.onRemoveNewLabelColor()}
                                onClick={()=>this.onAddNewLabel(color)}
                                ></div>
                            )}
                        </div>}
                        <div className="status-label-btn" onClick={closeEditLabelsModal}>
                            <span>Apply</span>
                        </div>
                    </>
                }
            </div>
        )
    }
}
