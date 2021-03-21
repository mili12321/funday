import React, { useEffect,useState,useRef } from 'react';
import { CgViewComfortable } from 'react-icons/cg'
// import { CreateBoard } from "./CreateBoard";
// import { PopupModal } from "./PopupModal";

export function ToolbarMenuActionsBtnModal({
    btnName,
    addNewBoard,
    addNewFloder,
    setIsShown
}) {
    // const [isShown, setIsShown] = useState(false)

    const getBtnOptions=()=>{
        let content = [];
        switch(btnName) {
            case 'Add':
                content.push(
                <> 
                    <div className="actions-btn actions-modal-btn modal-btn "
                     onClick={()=>{setIsShown(true)}}
                    //  onClick={addNewBoard}
                     >
                        <CgViewComfortable className="icon" />
                        <span>New Board</span>
                    </div>  
                    <div className="actions-btn modal-btn" onClick={addNewFloder}>
                        <CgViewComfortable className="icon" />
                        <span>New Folder</span>
                    </div>   
                </>
                );
                break; 
            case 'Filters':
                content.push(
                <>  
                   {btnName}
                </>
                );
                break;
            case 'Search':
                content.push(
                <> 
                   {btnName}
                </>
                );
                break;
            default:
                content.push('');
                break;
        }                                
        return content;
    }
    return (
        <>
        <div className='modal-default-style actions-modal-wrapper'>
           {getBtnOptions()}
        </div>
        {/* {isShown&&<PopupModal setIsShown={setIsShown} addNewBoard={addNewBoard}>
            <CreateBoard/>
        </PopupModal>} */}
        </>
    );
}
