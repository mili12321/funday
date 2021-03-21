import React, { useState,useRef,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from '../store/actions/userActions'

export function PinCheckbox({workspace}){

    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [checked, setChecked] = useState(loggedInUser.pinnedWorkspaces.includes(workspace._id))
   

    useEffect(() => {
        setChecked(loggedInUser.pinnedWorkspaces.includes(workspace._id))
    }, [workspace,loggedInUser.pinnedWorkspaces])


    function handleChange(workspaceId) {
        checked?unpinWorkspace(workspaceId):pinWorkspace(workspaceId)
    }

    function pinWorkspace(workspaceId) {
        const newUser= {
            ...loggedInUser,
            pinnedWorkspaces:[
                ...loggedInUser.pinnedWorkspaces,
                workspaceId
            ]
        }
        dispatch(updateUser(newUser))
    }

    function unpinWorkspace(workspaceId) {
        const newUser= {
            ...loggedInUser,
            pinnedWorkspaces:loggedInUser.pinnedWorkspaces.filter(id=>id!==workspaceId)
        }
        dispatch(updateUser(newUser))
    }

    return(
        <input type="checkbox"
                className="checkbox"
                defaultChecked={checked}
                onChange={()=>handleChange(workspace._id)}
        />
    )
}
