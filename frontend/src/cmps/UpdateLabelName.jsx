import React, { Component } from 'react'

export class UpdateLabelName extends Component {
    state={
        isUpdateLabelName:false,
        label:{}
    }
    async componentDidMount() {
        this.setState({label:this.props.statusLabel})
        this.editableLabelName = React.createRef();
    }
    handelChangeLabelName = (ev) => {
        this.setState({ label: { ...this.state.label, name: ev.target.value } },()=>{
            this.props.updateLabel(this.state.label)
        })
    }
    onUpdateLabelName=()=>{
        this.setState({label:this.props.statusLabel},()=>{
            this.setState({isUpdateLabelName:true},()=>{
                this.editableLabelName.current.focus()
                this.editableLabelName.current.select()
            })
        })
    }

    render() {
        const { isUpdateLabelName,label } = this.state
        const { statusLabel } = this.props
        return (
            <span 
                className="edit-label-name" 
                onClick={this.onUpdateLabelName} 
            >
                { isUpdateLabelName? 
                    <input 
                    className="update-label-name-input"
                    type="text" 
                    value={label.name} 
                    onChange={this.handelChangeLabelName}
                    ref={this.editableLabelName} 
                    onBlur={()=>{
                        this.setState({isUpdateLabelName:false})
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.target.blur()
                        }
                    }}
                    />
                    :
                    <span>{statusLabel.name}</span>
                }
            </span>
        )
    }
}
