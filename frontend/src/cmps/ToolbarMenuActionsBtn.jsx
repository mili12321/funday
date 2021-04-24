import React, { useEffect,useState,useRef } from 'react';
import { ToolbarMenuActionsBtnModal } from "./ToolbarMenuActionsBtnModal";
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'
import { CreateBoard } from "./CreateBoard";
import { PopupModal } from "./PopupModal";

export function ToolbarMenuActionsBtn({
    btnName,
    addNewBoard,
    addNewFloder
}) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isShown, setIsShown] = useState(false)
    const getBtnValue=()=>{
        let content = [];
        switch(btnName) {
            case 'Add':
                content.push(
                <> 
                    <AiOutlinePlusCircle className="icon"/>
                    <span>Add</span>       
                </>
                );
                break; 
            case 'Filters':
                content.push(
                <>  
                    <FiFilter className="icon"/>
                    <span>Filters</span> 
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
    <div 
    className='actions-btn-wrapper' 
    tabIndex='0'
     onBlur={()=>{setIsOpenModal(false)}}
     >
        { isOpenModal&&<ToolbarMenuActionsBtnModal
         btnName={btnName}
         addNewBoard={addNewBoard}
         addNewFloder={addNewFloder}
         setIsShown={setIsShown}
          />}
        <div className={`add actions-btn ${isOpenModal?'active':''}`} onClick={()=>{setIsOpenModal(curr=>!curr)}}>
            {getBtnValue()}
        </div>
    </div>

    {isShown&&<PopupModal setIsShown={setIsShown} >
            <CreateBoard addNewBoard={addNewBoard}  setIsShown={setIsShown}/>
        </PopupModal>}
    </>
    );
}
