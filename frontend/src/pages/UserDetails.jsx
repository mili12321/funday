import React, { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateUser} from '../store/actions/userActions'
import { UploadImg } from '../cmps/UploadImg'
import { BsPencil } from 'react-icons/bs'
import { RiUser3Fill, RiPhoneFill } from 'react-icons/ri'
import { HiOutlineMail } from 'react-icons/hi'
import { AiFillSkype,AiFillGift } from 'react-icons/ai'
import { IoLocationOutline } from 'react-icons/io5'
import { BiTime } from 'react-icons/bi'
import { BiCalendarStar } from 'react-icons/bi'

export function UserDetails(){
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [name, setName] = useState(loggedInUser.username)
    const [isUpdate, setUpdate] = useState(false)
    const dispatch = useDispatch();
    const inputRef = useRef()

    useEffect(() => {
        setName(loggedInUser.username)
    }, [loggedInUser])

    const onUpdating=()=>{
        if(loggedInUser.username===name)return
        const newUser= {
            ...loggedInUser,
            username:name
        }
        dispatch(updateUser(newUser))
    }

    const headerTitles = [
        'Personal Info',
        'Working Status',
        'Password',
        'Preferences',
        'Notifications',
        'Email Integration',
        'Sessions'
    ]

    const icons = [
        <RiUser3Fill className="icon"/>,
        <HiOutlineMail className="icon"/>,
        <RiPhoneFill className="icon"/>,
        <AiFillSkype className="icon"/>,
        <IoLocationOutline className="icon"/>,
        <BiTime className="icon"/>,
        <AiFillGift className="icon"/>,
        <BiCalendarStar className="icon"/>,
    ]

    const titles=[
        'Title',
        'Email',
        'Phone',
        'Skype',
        'Location',
        'Timezone',
        'Birthday',
        'Work Anniversary',
    ]

    const userDetails=[
        'Professional Engineer of something',
        `${loggedInUser.email}`,
        'Add a phone number',
        'Add a Skype number',
        'Dallas, TX',
        'Jerusalem',
        'Every day 🎉',
        'Add a work anniversary'
    ]

   
    return (
        <div className="user-details">
            <div className="details-header">
                <div className="upload-img-wrapper">
                    <UploadImg itemName='user'/>
                </div>
                <div className="updating-user-name-wrapper">
                {!isUpdate?
                    <div className="user-name" onClick={()=>{
                        setUpdate(true)
                        setTimeout(() => {
                            if(inputRef&&inputRef.current){
                                inputRef.current.focus()
                            }
                        }, 0);
                    }}>
                        <div>{name}</div>
                        <BsPencil className="BsPencil"/>
                        <span className="label-text edit-name">Edit name</span>
                    </div>
                    :
                    <input 
                    className="update-name"
                    ref={inputRef} 
                    type="text" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    onBlur={()=>
                        {
                            onUpdating()
                            setUpdate(false)
                        }
                    }
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.target.blur()
                        }
                    }}
                    />
                }
                </div>
                <div className="header-navigation">
                    {headerTitles.map(title=>
                        <div className="title">{title}</div>
                    )}
                </div>
            </div>
            <div className="details-main">
                <div className="details-main-content-wrapper">
                    <div className='title'>Overview</div>
                    {titles.map((title,idx)=>
                    <div className="overview-row-container">
                        <div className="icon-wrapper">{icons[idx]}</div>
                        <div className="user-info-wrapper">
                                <div>{title}:</div>
                                <div>{userDetails[idx]}</div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}