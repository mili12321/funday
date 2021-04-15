import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContentEditable from 'react-contenteditable';
import { BiGridVertical } from 'react-icons/bi'
import { CgExpand } from 'react-icons/cg'
import { AiOutlineShrink } from 'react-icons/ai'
import { getColumnWidth } from "./task-cells-width.js";
import { TitleOptionsBtn } from './TitleOptionsBtn'

class _TableColumnPreview extends Component {
    state={
        table:{},
        board:{},
        currTableColumn:{},
        isDivOnFocus:false,
        isShownTitleOptionsModal:false
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
                            const desc = `changed group name from "${this.props.table.name}" to "${this.state.table.name}"`
                            const updatedTable = {
                                ...this.props.table,
                                name: this.state.table.name
                            }
                            this.props.onEditTable(updatedTable,desc)
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
                            const desc = `changed the table column name from ${this.props.tableColumn.title} to ${this.state.currTableColumn.title}`
                            const updatedBoard = {
                                ...this.props.board,
                                tableColumns: [...this.state.board.tableColumns],
                                activities:[
                                    {
                                        desc: desc,
                                        userId: this.props.loggedInUser._id,
                                        createdAt: Date.now()
                                    },
                                    ...this.props.board.activities]
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

    
    getTitleColumnStyle = (columnName) =>
    {
        switch (columnName) {
            case 'checkBox':
                return 'checkBox-title'
            default:
                return ''
        }
    }

    toggleTitleOptionsModal=()=>{
        this.setState({isShownTitleOptionsModal:!this.state.isShownTitleOptionsModal})
    }    
    closeTitleOptionsModal=()=>{
        this.setState({isShownTitleOptionsModal:false})
    }

    render() {
        const { board, tableColumn, table, IoMdNotifications } = this.props
        if (!tableColumn) return <div>Loading....</div>
        return (
            <div key={tableColumn._id} className={`table-cell title-cell ${this.getTitleColumnStyle(tableColumn.taskKey)} ${getColumnWidth(tableColumn.taskKey)} ${this.state.isShownTitleOptionsModal?'updating':''}`} style={{color:`${table.color}` }}>
                {tableColumn.taskKey==="createdAt"?
                    <>
                        <div className="date-title-wrapper">
                            <IoMdNotifications style={{ width: '18px', height: '18px' }}/>
                            <span>{this.changeToContentEditable(tableColumn)}</span>
                        </div>
                        <TitleOptionsBtn 
                        toggleTitleOptionsModal={this.toggleTitleOptionsModal}
                        isShownTitleOptionsModal={this.state.isShownTitleOptionsModal}
                        closeTitleOptionsModal={this.closeTitleOptionsModal}
                        tableColumn={this.props.tableColumn}
                        table={this.props.table}
                        onEditBoard={this.props.onEditBoard}
                        onEditTable={this.props.onEditTable}
                        onEditTask={this.props.onEditTask} 
                        />
                    </>
                    :
                    <>
                    {this.changeToContentEditable(tableColumn)}
                    <TitleOptionsBtn 
                    toggleTitleOptionsModal={this.toggleTitleOptionsModal}
                    isShownTitleOptionsModal={this.state.isShownTitleOptionsModal}
                    closeTitleOptionsModal={this.closeTitleOptionsModal}
                    tableColumn={this.props.tableColumn}
                    table={this.props.table}
                    onEditBoard={this.props.onEditBoard}
                    onEditTable={this.props.onEditTable}
                    onEditTask={this.props.onEditTask} 
                    />
                    </>
                }
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loggedInUser: state.user.loggedInUser
    }
}

export const TableColumnPreview = connect(mapStateToProps)(_TableColumnPreview)