import React, { Component } from 'react'
import {UpdateLabelName} from './UpdateLabelName'
import {TiDelete} from 'react-icons/ti'

export class StatusLabelPreview extends Component {
    state={
        isUpdateLabelColor:false,
        newLabelColor:null,
        currLabel:{}
    }
    async componentDidMount() {
        this.setState({currLabel:this.props.statusLabel})
    }
    onToggleUpdateLabelColor=(currLabel)=>{
        this.setState({isUpdateLabelColor:!this.state.isUpdateLabelColor},()=>{
            this.props.hideColorPicker(this.state.isUpdateLabelColor)
        })
        this.setState({currLabel})
    }
    onChangeNewLabelColor=(currColor)=>{
        this.setState({newLabelColor:currColor})
    }
    onRemoveNewLabelColor=()=>{
        this.setState({newLabelColor:null})
    }
    onSaveColor=(color)=>{
        if(this.state.isUpdateLabelColor){
        this.setState({currLabel:{...this.state.currLabel, color:color}})
        this.setState({isUpdateLabelColor:false},()=>{
            this.props.hideColorPicker(this.state.isUpdateLabelColor)
            this.props.updateLabel(this.state.currLabel)
        })
        }
        
    }
    render() {
        const { isUpdateLabelColor } = this.state
        const { BsDroplet,statusLabel,colorsPicker,idx,updateLabel ,provided } = this.props
        return (
            <>
            <div 
            className={`stat-label-edit-wrapper ${idx>5?'sec-column':''}`} 
            ref={provided.innerRef} {...provided.draggableProps}
            >
            <div className="status-label-dots-btn"  
            {...provided.dragHandleProps}
            >
               ::
            </div>
            <div 
                title={`${statusLabel.name}`}
                className={`stat-label-edit ${statusLabel.name.length>13?'ellipsis-label-name-edit':''}`}
                tabindex="0"
            >
                {!isUpdateLabelColor?   
                    <span className="edit-label-color" style={{backgroundColor:`${statusLabel.color}`}} onClick={()=>this.onToggleUpdateLabelColor(statusLabel)}>
                        <BsDroplet className={`BsDroplet ${statusLabel.color==='black'?'light-drop-on-dark-color':''}`}/>
                    </span>
                :
                    <span className="edit-label-color" style={{backgroundColor:`${this.state.newLabelColor?this.state.newLabelColor:statusLabel.color}`}} onClick={()=>this.onToggleUpdateLabelColor(statusLabel)} >
                        <BsDroplet className={`BsDroplet ${statusLabel.color==='black'?'light-drop-on-dark-color':''}`}/>
                    </span>
                }
                {/* { !isUpdateLabelColor?
                <UpdateLabelColor statusLabel={statusLabel} BsDroplet={BsDroplet} onToggleUpdateLabelColor={this.onToggleUpdateLabelColor} comStyle={{backgroundColor:`${statusLabel.color}`}}/>:
                <UpdateLabelColor statusLabel={statusLabel} BsDroplet={BsDroplet} onToggleUpdateLabelColor={this.onToggleUpdateLabelColor} comStyle={{backgroundColor:`${this.state.newLabelColor?this.state.newLabelColor:statusLabel.color}`}}/>} */}

                <UpdateLabelName statusLabel={statusLabel} updateLabel={updateLabel}/>
            </div> 
            <div className="status-label-delete-btn" onClick={()=>this.props.onRemoveLabel(statusLabel._id)}>
                <TiDelete/>
                <span className="label-text-on-top">Delete Labels</span>
            </div>
        </div>

        {isUpdateLabelColor&&
        <div className="label-color-edit" style={{gridRowStart: idx<6?idx+2:idx-4,gridRowEnd:idx<6?idx+6:idx}}>
            <div className='status-color-picker'>
                {colorsPicker.map(color=>
                    <div 
                    className="color" 
                    style={{backgroundColor:`${color}`}}
                    onMouseEnter={() => this.onChangeNewLabelColor(color)}
                    onMouseLeave={() => this.onRemoveNewLabelColor()}
                    onClick={()=>this.onSaveColor(color)}
                    ></div>
                )}
            </div>
        </div>
        }
           </>
        )
    }
}
