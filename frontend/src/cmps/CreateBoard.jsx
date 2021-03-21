import React, { useState,useRef,useEffect } from 'react';

export function CreateBoard({setIsShown,addNewBoard}) {

    const[newBoardName,setNewBoardName]=useState('New Board')
    const inputEl = useRef()
    useEffect(() => {
        setTimeout(() => {
            inputEl.current.focus()
        }, 0); 
    }, [])
    const focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    const handleChangeName =(ev)=>{
        setNewBoardName(ev.target.value)
    }
    return (
    <div className="create-item-wrapper">
        <div className="create-item-title">Create board</div>
        <input 
            className="new-item-input"
            type="text" 
            value={newBoardName} 
            onChange={handleChangeName}
            onFocus={focusText}
            ref={inputEl}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                    if(newBoardName.length<1)return
                    addNewBoard(newBoardName)
                    setIsShown(false)
                }
            }}
        />
        <div className="btns-container">
            <div className="cancel-btn" onClick={ ()=>{setIsShown(false)} }>Cancel</div>
            <div className='add-btn' onClick={()=>{
            if(newBoardName.length<1)return
            addNewBoard(newBoardName)
            setIsShown(false)
            }}>Create Board</div>
        </div>
    </div>
    )
}