import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from '../store/actions/userActions'

export function OwnerModal({
    task,
    table,
    onEditTask,
}){
    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);
    const [owners, setOwners] = useState(null);
    const [newUsers, setNewUsers] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(loadUsers())
    }, [dispatch])    

    function mapOrder (array, order, key) {
        array.sort( function (a, b) {
          var A = a[key], B = b[key];
          if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
          } else {
            return -1;
          }
        });
        return array;
    };
    
    useEffect(() => {
        //sorted by the task.owner order!
        const itemsArray = users.filter(user=>
            task.owner.includes(user._id)
        )
        const itemOrder = [...task.owner]
        const orderedArray = mapOrder(itemsArray, itemOrder, '_id');

        setOwners(orderedArray)
    }, [task,users])    
    
    useEffect(() => {
            if(owners){
                const IdList = []
                owners.map(owner=>
                    IdList.push(owner._id)
                )
                setNewUsers(
                    users.filter(user=>
                        !IdList.includes(user._id)
                    )
                )
            }
    }, [users,owners])

    const updateTaskOwner=(userId)=>{
        const updatedTask = {
            ...task,
            owner:[...task.owner,userId]
        }
        onEditTask(table,updatedTask)
        // setToggleOwnerModal(false)
    }
    const removeOwner=(userId)=>{
        const updatedTask = {
            ...task,
            owner:task.owner.filter(id=>id!==userId),
        }
        onEditTask(table,updatedTask)
    }
const getUserName=(name)=>{
    let content  = []
    for (var i = 0; i < name.length; i++) {
        content.push(
            <span className={`${search.toLowerCase().includes(name[i].toLowerCase())?'bold':''}`}>{name[i]}</span>
        )
    }
    return content
}
function getLine(){
    let content  = []
    for (let i = 0; i < 12; i++) {
        content.push(
            <span className="title-line">
               -
            </span>
        )
    }
    return content
}
    return (
       <>
            <div className="owners-container">
            {owners&&owners.map(owner=>
                 <div className="owner-details">
                    <img className="user-img" src={`${owner.avatar}`} alt="" srcset=""/>
                    <span className="user-name">{owner.username}</span>
                    <span className="remove-user"
                    onClick={()=>removeOwner(owner._id)}
                    >x</span>
                 </div>
            )}
            </div>
            <input type="text" placeholder='Enter name'
            className="owner-modal-input"
            onChange={(e)=>setSearch(e.target.value)}
            /> 
            <div className="title">
                {getLine()}
               <span className="title-contant"> People </span>
                {getLine()}
            </div>
            {newUsers&&newUsers.map(user=>
            user.username.toLowerCase().includes(search.toLowerCase())?
                <div className="user-details" onClick={()=>updateTaskOwner(user._id)}>
                    <img className="user-img" src={`${user.avatar}`} alt="" srcset=""/>
                    <span className="user-name">
                       { getUserName(user.username)}
                    </span>
                </div>
                :
                null
            )}
          {/* <div>Teames</div> */}
        </>
    )
}
