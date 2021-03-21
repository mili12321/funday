import React, { useEffect,useState } from 'react';
import { IoIosArrowForward,IoIosAddCircleOutline } from 'react-icons/io'
import {VscPinned } from 'react-icons/vsc'
import {MdSortByAlpha } from 'react-icons/md'
import { WorkspaceList } from './WorkspaceList';
import { ForwardModal } from "./ForwardModal";

export function ToolbarOptionsModal({
    setIsShown,
    setIsOpenToolbarOptionsModal,
    toggleShownForwardModal,
    onSortWorkspces,
    isSorted
}){

    const [search, setSearch] = useState("");

    return(
    <div className="modal-default-style item-actions-modal toolbar-options-modal">
        <div className="modal-btn item-actions-btn" onMouseDown={()=>{
            setIsShown(true)
            setIsOpenToolbarOptionsModal(false)
            }}
        >
            <IoIosAddCircleOutline className="icon"/>
           <span>Add new workspace</span>
        </div>
        <ForwardModal  
        btn={<div>
                <VscPinned className="icon"/>
                <span>Pin workspaces</span>
            </div>
        }
        toggleShownForwardModal={toggleShownForwardModal}
        itemList={true}
        setSearch={setSearch} 
        >
            <div className="pin-workspace-title">Choose Workspace to pin on menu</div>
            <WorkspaceList 
            isCheckbox = {true}
            search={search} 
            setSearch={setSearch} 
            />
        </ForwardModal>
        <div className="modal-btn item-actions-btn"
         onMouseDown={()=>{
            onSortWorkspces()
            setIsOpenToolbarOptionsModal(false)
        }}
        >
            <MdSortByAlpha className="icon"/>
            <span>Sort by {`${isSorted?'default':'alphabetical'}`} order</span>
        </div>
    </div>
    )
}