import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from '../store/actions/userActions'

export function OwnerModal({
    task,
    table,
    onEditTask
}){
    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);
    const [owners, setOwners] = useState(null);
    const [newUsers, setNewUsers] = useState(null);
    const [search, setSearch] = useState('');
    const inputEl = useRef(null)

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

    const updateTaskOwner=(userId,userName)=>{
        const updatedTask = {
            ...task,
            owner:[...task.owner,userId]
        }
        const desc = `added new owner "${userName}" to task "${updatedTask.name}" inside "${table.name}"`
        onEditTask(table,updatedTask,desc)
        // setToggleOwnerModal(false)
    }
    const removeOwner=(userId,userName)=>{
        const updatedTask = {
            ...task,
            owner:task.owner.filter(id=>id!==userId),
        }
        const desc = `removed owner "${userName}" from task "${updatedTask.name}" inside "${table.name}"`
        onEditTask(table,updatedTask,desc)
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

// useEffect(() => {
//     if(inputEl&&inputEl.current){
//         inputEl.current.focus()
//     }
// }, [])

    return (
       <>
            <div className="owners-container">
            {owners&&owners.map(owner=>
                 <div className="owner-details">
                    <img className="user-img" src={`${owner.avatar}`} alt="" srcset=""/>
                    <span className="user-name">{owner.username}</span>
                    <span className="remove-user"
                    onClick={()=>{
                        removeOwner(owner._id,owner.username)
                    }}
                    >x</span>
                 </div>
            )}
            </div>
            <input type="text" placeholder='Enter name'
            className="owner-modal-input"
            ref={inputEl}
            onChange={(e)=>setSearch(e.target.value)}
            /> 
            <div className="title">
                {getLine()}
               <span className="title-contant"> People </span>
                {getLine()}
            </div>
            <div className="owner-list-wrapper">
            {newUsers&&newUsers.map(user=>
            user.username.toLowerCase().includes(search.toLowerCase())?
                <div className="user-details" onClick={()=>
                {
                    updateTaskOwner(user._id,user.username)
                }}
                >
                    <img className="user-img" src={`${user.avatar}`} alt="" srcset=""/>
                    <span className="user-name">
                       { getUserName(user.username)}
                    </span>
                </div>
                :
                null
            )}
            </div>
          {/* <div>Teames</div> */}
        </>
    )
}

