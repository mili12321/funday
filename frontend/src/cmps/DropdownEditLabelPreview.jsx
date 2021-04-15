import React, { useEffect,useState,useRef } from 'react';
import userService from '../services/userService';
import { RiCloseCircleFill } from 'react-icons/ri'

export function DropdownEditLabelPreview({label,onEditBoardLabel,onRemoveLabelFromBoard}) {

    const [isUpdating , setIsUpdating ] = useState(false);
    const [newLabel , setNewLabel ] = useState(label);

    useEffect(() => {
        setNewLabel(label)
    }, [label])

    return(
        <div className="edit-label-wrapper">
        {isUpdating?
            <input 
            type="text" 
            value={newLabel.name} 
            onChange={(e)=>setNewLabel({...label,name:e.target.value})}
            onBlur={()=>{
                setIsUpdating(false)
                //updating the board label array
                onEditBoardLabel(label,newLabel)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    if(e.target.value.trim().length<1){
                        setNewLabel(label)
                        setIsUpdating(false)
                        return
                    }
                    e.target.blur()
                }
            }}
            />
            :<span className='dropdown-baord-label' onClick={()=>setIsUpdating(true)}>
                {newLabel.name}
            </span>
        }
            <span onClick={()=>onRemoveLabelFromBoard(newLabel)}><RiCloseCircleFill className="close-btn"/></span>
        </div>
    )
}