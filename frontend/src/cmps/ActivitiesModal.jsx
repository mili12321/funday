import React from 'react';
import { useSelector } from "react-redux";
import { AiOutlineClockCircle } from 'react-icons/ai'
import moment from 'moment'

export function ActivitiesModal() {

    const currBoard = useSelector(state => state.workspace.currBoard);
    const users = useSelector(state => state.user.users);

    function getUser(userId) {
        const user = users.filter(user=>user._id===userId)[0]
        return user
    }

    function  getTime(date) {
        const time = moment(date).fromNow()
        switch (true) {
            case time.includes('a few seconds ago'):
                return 'now';
            case time.includes('a minute ago'):
                return time.replace('a minute ago', '1m');
            case time.includes('minutes'):
                return time.replace(' minutes ago', 'm');
            case time.includes('an hour ago'):
                return time.replace('an hour ago', '1h');
            case time.includes('hours'):
                return time.replace(' hours ago', 'h');
            case time.includes('a day ago'):
                return time.replace('a day ago', '1d');
            case time.includes('days'):
                return time.replace(' days ago', 'd');
            case time.includes('a month ago'):
                return time.replace('a month ago', '1M');
            case time.includes('months'):
                return time.replace(' months ago', 'M');
            default:
                return time;
        }
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