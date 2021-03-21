import React, { useState,useRef,useEffect } from 'react';
import {IoArrowForwardCircleOutline } from 'react-icons/io5'
import { IoIosArrowForward } from 'react-icons/io'
export function ForwardModal({
    children,btn,setMoveToObject,isFolderModal,
    toggleShownForwardModal,isWorkspaceIconPicker,
    itemList,moveToObject,setSearch

}) {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        toggleShownForwardModal(isShown)
    }, [isShown,toggleShownForwardModal])

    return (
        <div className='forward-modal-btn-wrapper'
        onMouseOver={()=>setIsShown(true)}
        onMouseLeave={()=>{
            setIsShown(false)
            if(isFolderModal){
                setMoveToObject(null)
            }
            (itemList||moveToObject)&&setSearch('')
        }}
       >
           <div  
           className={`modal-btn item-actions-btn forward-modal-btn ${isShown?'open-modal':''} `}
           >
                {btn}
               <IoIosArrowForward className="icon"/>
           </div>
           {
                   isShown&&
                   <div 
                   className={`modal-default-style ${isWorkspaceIconPicker?'menu-icon-picker':'forward-modal'}
                   ${itemList||moveToObject?'items-list':''}
                   `}
                   >
                        {children}
                   </div>
           }
       </div>     
    );
}
