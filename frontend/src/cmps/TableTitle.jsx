import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable';

export class TableTitle extends Component {
    state={
        table:{},
        board:{},
        currTableColumn:{}
    }
    componentDidMount(){
        this.setState({table:this.props.table})
        this.setState({board:this.props.board})
        this.setState({currTableColumn:this.props.tableColumn})
        this.editableGroupName = React.createRef();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currTableColumn.title !== this.state.currTableColumn.title) {
            this.setState({board:this.props.board})
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
    changeToContentEditable=(value)=>{
            let content = [];
            if(value.taskKey==='name'){
                content.push(
                    <ContentEditable
                        onFocus={this.focusText}
                        className='content-editable'
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
                )
            }
            return content;
    }

    render() {
        const { board, tableColumn, table, IoMdNotifications } = this.props
        if (!tableColumn) return <div>Loading....</div>
        return (
            this.changeToContentEditable(tableColumn)
        )
    }
}