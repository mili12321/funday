import React, { useEffect,useState,useRef } from 'react';
import { useSelector } from "react-redux";
import { CreateWorkspace } from "./CreateWorkspace";
import { PopupModal } from "./PopupModal";
import { ToolbarOptionsModal } from "./ToolbarOptionsModal";
import { DynamicFaIcon } from "../data/dynamicFaIcon";

export function BoardToolbar({BsLightning, BsStar, BsThreeDots, onGettingCurrentWorkspace,addNewWorkspace,onSetToolbarMenu}) {
    const allWorkspaces = useSelector(state => state.workspace.workspaces);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [workspaces,setWorkspaces] = useState(allWorkspaces.filter(
        workspace=>loggedInUser.pinnedWorkspaces.includes(workspace._id))
        )
    const currWorkspace = useSelector(state => state.workspace.currWorkspace);
    const [activeBtn, setActiveBtn] = useState(currWorkspace._id)
    const [activeBtnClass, setActiveBtnClass] = useState()
    const [isShown, setIsShown] = useState(false)
    const [isOpenToolbarOptionsModal, setIsOpenToolbarOptionsModal] = useState(false)
    const [isShownPinWorkspaceModal, setIsShownPinWorkspaceModal] = useState(false)
    const btnEl = useRef()
    const [isSorted, setIsSorted] = useState(false)
    const [pinedworkspaces, setPinedworkspaces] = useState(false)




    useEffect(() => {
        setWorkspaces(allWorkspaces.filter(
            workspace=>loggedInUser.pinnedWorkspaces.includes(workspace._id))
            )
    }, [loggedInUser,loggedInUser.pinnedWorkspaces,allWorkspaces])

    useEffect(() => {
        setActiveBtn(currWorkspace._id)
    }, [currWorkspace,workspaces])
    
    useEffect(() => {
        setActiveBtnClass(activeBtn)
        onSetToolbarMenu(activeBtn)
    }, [activeBtn,onSetToolbarMenu])

    useEffect(() => {
        if(!isShownPinWorkspaceModal){
            setTimeout(() => {
                if(btnEl&&btnEl.current){
                    btnEl.current.focus()
                }
            }, 0);
        }
    }, [isShownPinWorkspaceModal])

    const toggleShownForwardModal=(val)=>{
        setIsShownPinWorkspaceModal(val)
    }

    function onSortWorkspces() {
        setIsSorted(curr=>!curr)
    }

    useEffect(() => {
        if(isSorted){
            let array = [...workspaces]
            array.sort((a, b) => a.name.localeCompare(b.name)) 
            setPinedworkspaces(array)
        }else{
            setPinedworkspaces(workspaces)
        }
    }, [isSorted,workspaces])
   

    if (!pinedworkspaces) return <div>Loading....</div>
    return (
    <div className="board-toolbar">
        <div className="board-first-area">
            <div className="icon-wrapper">
                <BsLightning 
                className={`tollbar-icon ${activeBtnClass==='lightning'?'selected':''}`}
                onClick={()=>setActiveBtn('lightning')}
                />
                <span className="label-text">Quick Search</span>
            </div>
            <div className="icon-wrapper">
                <BsStar 
                className={`tollbar-icon ${activeBtnClass==='favorite'?'selected':''}`}
                onClick={()=>setActiveBtn('favorite')}
                />
                <span className="label-text">Favorite boards</span>
            </div>
            {
                pinedworkspaces.map((workspace,idx)=>
                    <div key={workspace._id}
                    className={`workspace-wrapper ${activeBtnClass===workspace._id?'selected':''}`}
                    onClick={()=>setActiveBtn(workspace._id)}
                    >
                        <div 
                        className="workspace-icon" 
                        onClick={()=>onGettingCurrentWorkspace(workspace)}
                        style={{backgroundColor:workspace.color}}
                        >
                        <DynamicFaIcon name={workspace.img} />
                        </div>
                    </div>
                )
            }
            </div>
        <div className="board-second-area">
            <div className="icon-wrapper"
            tabIndex="0"
            onClick={()=>{setIsOpenToolbarOptionsModal(curr=>!curr)}}
            onBlur={()=>{
                setIsOpenToolbarOptionsModal(isShownPinWorkspaceModal)
            }}
            ref={btnEl}
            >
                <BsThreeDots
                className={`tollbar-icon ${isOpenToolbarOptionsModal?'selected':''}`}
                />
            </div>

            {isOpenToolbarOptionsModal&&
                <ToolbarOptionsModal 
                setIsOpenToolbarOptionsModal={setIsOpenToolbarOptionsModal}
                setIsShown={setIsShown}
                toggleShownForwardModal={toggleShownForwardModal}
                onSortWorkspces={onSortWorkspces}
                isSorted={isSorted}
                />
            }
        </div>
        {isShown&&<PopupModal setIsShown={setIsShown} >
            <CreateWorkspace setIsShown={setIsShown} addNewWorkspace={addNewWorkspace}/>
        </PopupModal>}
    </div>
    );
}