import React from 'react';
import { IoCloseOutline } from 'react-icons/io5'

export function PopupModal({setIsShown,children}) {
    return (
        <div className={ `modal-wrapper` }>
            <div className="modal-content" onClick={ (ev) => ev.stopPropagation() }>
                <div className="close-popup-modal" onClick={ ()=>{setIsShown(false)} }><IoCloseOutline className="icon"/></div>
               { children }
            </div>
        </div >
    )
}