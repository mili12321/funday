import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable';
import { BiGridVertical } from 'react-icons/bi'
import { CgExpand } from 'react-icons/cg'
import { AiOutlineShrink } from 'react-icons/ai'

export class TableColumnPreview extends Component {
    state={
        table:{},
        board:{},
        currTableColumn:{},
        isDivOnFocus:false
    }
    componentDidMount(){
        this.setState({table:this.props.table})
        this.setState({board:this.props.board})
        this.setState({currTableColumn:this.props.tableColumn})
        this.editableGroupName = React.createRef();
        this.editableGroupTitle = React.createRef();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currTableColumn.title !== this.state.currTableColumn.title) {
            this.setState({board:this.props.board})
        }
        if (prevProps.tableColumn.title !== this.props.tableColumn.title) {
            this.setState({board:this.props.board})
        }
        if(prevProps.board !== this.props.board){
            this.setState({          
                board: this.props.board
            });
            this.setState({currTableColumn:this.props.tableColumn})
        }
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
 
    handleChangeGroupName = (ev) => {
        this.setState({ table: { ...this.state.table, name: ev.target.value } })
    }
    handleChangeGroupTitle=(ev)=>{
        this.setState({ currTableColumn : {...this.props.tableColumn, title:ev.target.value} },()=>{
            this.setState({ board: { ...this.props.board, tableColumns:
                this.props.board.tableColumns.map(tableColumn=>
                    tableColumn._id===this.state.currTableColumn._id?
                    this.state.currTableColumn:tableColumn
                )
            } })
        })
    }
    toggleFocusOnDiv=(bool)=>{
        this.setState({isDivOnFocus:bool})
    }
    changeToContentEditable=(value)=>{
        const {dragHandle} = this.props
            let content = [];
            if(value.taskKey==='name'){
                content.push(
                    <div 
                    className={`${this.props.isOpenTableColorModal?'':'table-name-wrapper'}`}
                    tabIndex='0' 
                    onClick={()=> this.toggleFocusOnDiv(true)} 
                    onBlur={()=>
                        {
                        this.toggleFocusOnDiv(false)
                        this.props.closeTableColorModal()
                        }   
                    }  
                    >

                        <div className="table-actions">
                            {!this.props.isExpand?<CgExpand className="expand-btn" onClick={()=>this.props.toggleExpandeTable(true)}/>:
                            <AiOutlineShrink className="shrink-btn" onClick={()=>this.props.toggleExpandeTable(false)}/> }
                            <div  className="drag-btn"  {...dragHandle.dragHandleProps}>
                            <BiGridVertical/>
                            </div>
                        </div>
                        <ContentEditable
                        onFocus={this.focusText}
                        className={`content-editable ${this.props.isOpenTableColorModal?'focus':''}`}
                        innerRef={this.editableGroupName}
                        html={this.state.table.name}
                        disabled={false}  
                        onChange={this.handleChangeGroupName}
                        onBlur={() => {
                            if (this.props.table.name === this.state.table.name) return
                            // const desc = `${loggedUser.fullName} Changed the task name from ${task[taskKey]} to ${this.state.task.name}`
                            const updatedTable = {
                                ...this.props.table,
                                name: this.state.table.name
                            }
                            this.props.onEditTable(updatedTable)
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                        />
                    </div>
                )
            }else{
                content.push(
                    <ContentEditable
                        onFocus={this.focusText}
                        className='content-editable'
                        innerRef={this.editableGroupTitle}
                        html={this.state.currTableColumn.title}
                        disabled={false}  
                        onChange={this.handleChangeGroupTitle}
                        onBlur={() => {
                             if (this.props.tableColumn.title === this.state.currTableColumn.title) return
                            // const desc = `${loggedUser.fullName} Changed the task name from ${task[taskKey]} to ${this.state.task.name}`
                            const updatedBoard = {
                                ...this.props.board,
                                tableColumns: [...this.state.board.tableColumns]
                            }
                            this.props.onEditBoard(updatedBoard)
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                    />
                )
            }
            
            return content;
    }

    render() {
        const { board, tableColumn, table, IoMdNotifications } = this.props
        if (!tableColumn) return <div>Loading....</div>
        return (
            <div key={tableColumn._id} className={`table-cell title-cell ${tableColumn.taskKey==="checkBox"?'checkBox-title':''}`} style={{color:`${table.color}` }}>
                {tableColumn.taskKey==="createdAt"?
                    <React.Fragment>
                        <IoMdNotifications style={{ width: '18px', height: '18px' }}/>
                        <span>{this.changeToContentEditable(tableColumn)}</span>
                        {/* <span>{tableColumn.title}</span> */}
                    </React.Fragment>
                    :
                    this.changeToContentEditable(tableColumn)
                }
            </div>
        )
    }
}