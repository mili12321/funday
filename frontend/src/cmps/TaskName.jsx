import React, { Component } from 'react'
import { FaRegUserCircle,FaPencilAlt } from 'react-icons/fa'
import { TiArrowSortedDown } from 'react-icons/ti'
import {  IoChatbubbleOutline, } from 'react-icons/io5'
import ContentEditable from 'react-contenteditable';
import { TaskStatus } from "./TaskStatus";

export class TaskName extends Component {
    state={
        task:{},
        table:{},
        isUpdating:false
    }
    async componentDidMount() {
        this.setState({task:this.props.task})
        this.setState({table:this.props.table})
        this.editableTaskName = React.createRef();
    }
    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    handleChangeName = (ev) => {
        this.setState({ task: { ...this.state.task, name: ev.target.value } })
    }

    toggleOptionsModal=()=>{
        this.setState({isShowOptionsModal:!this.state.isShowOptionsModal})
    }
    closeOptionsModal=()=>{
        this.setState({isShowOptionsModal:false})
    }
    onRemoveTask=(currTask)=>{
        const newTable = {
            ...this.props.table,
            tasks:this.props.table.tasks.filter(task=>task._id!==currTask._id)
        }
        const desc = `removed task "${currTask.name}" from "${this.props.table.name}"`
        this.props.onEditTable(newTable,desc)
        this.setState({isShowOptionsModal:false})
    }

    render() {
        const { task , taskKey, table } = this.props
        const { isUpdating } = this.state
        if (!task) return <div>Loading....</div>
        return (
            <React.Fragment>
            <div className="task-name-wrapper">
                <span className={`${isUpdating?'task-name-span-updating':''}`}>
                {isUpdating?
                    <input 
                    className="task-name"
                    onFocus={this.focusText}
                    type="text" 
                    name="name" 
                    ref={this.editableTaskName} 
                    value={this.state.task[taskKey]} 
                    onChange={this.handleChangeName}
                    onBlur={() => {
                        if (this.props.task[taskKey] === this.state.task[taskKey]) return
                        const desc = `changed the task name from ${this.props.task[taskKey]} to ${this.state.task[taskKey]}`
                        const updatedTask = {
                            ...this.props.task,
                            name: this.state.task.name
                        }
                        this.props.onEditTask(table,updatedTask,desc)
                        this.setState({isUpdating:false})
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.target.blur()
                        }
                    }}
                    />:
                    <span>{task[taskKey]}</span>
                }
                </span>
                <FaPencilAlt className="FaPencilAlt" onClick={() => {
                    this.setState({isUpdating:true},()=>
                    this.setState({task},()=>
                    this.editableTaskName.current.focus()
                    )
                    )
                }}/>
            </div>


            <IoChatbubbleOutline style={{ width: '30px', height: '30px', color:"rgb(180, 182, 188)" }}/>
        </React.Fragment>
        )
    }
}

