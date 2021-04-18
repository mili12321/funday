import React from 'react';
import { useSelector } from "react-redux";
import { AiOutlineClockCircle } from 'react-icons/ai'
import { getTime } from '../data/getTimePass'


export function ActivitiesModal() {

    const currBoard = useSelector(state => state.workspace.currBoard);
    const users = useSelector(state => state.user.users);

    function getUser(userId) {
        const user = users.filter(user=>user._id===userId)[0]
        return user
    }

    return(
        <div className="activities-container">
            <div className="title"><span>{currBoard.name}</span> Log</div>
        {
            currBoard.activities.length>0?
            <table className="activities-list">
            {currBoard.activities.map(activity=>
                <tr className="activity-preview">
                    <td className="time">
                        <AiOutlineClockCircle/><span>{getTime(activity.createdAt)}</span>
                    </td>
                    <td>
                        <div className="user background" style={{backgroundImage:`url(${getUser(activity.userId).avatar})`}}></div>
                    </td> 
                    <td className="desc">
                        <span className="username">{getUser(activity.userId).username}</span> <span>{activity.desc}</span>
                    </td>
                </tr>
            )}
            </table>
            :
            <div>No activities</div>
        }

        </div>
    )
}