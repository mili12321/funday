import React, { useEffect,useState,useRef } from 'react';
import { IoMdNotificationsOutline, IoIosSearch } from 'react-icons/io'
import { BsGrid } from 'react-icons/bs'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/actions/userActions'
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom"
import { UploadImg } from "./UploadImg"
import { NotificationsModal } from "./NotificationsModal"


export function Navbar(){
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [activeBtn, setActiveBtn] = useState(null)
    const [isShown, setShowModal] = useState(null)
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const dispatch = useDispatch();
    const history = useHistory();
    const notificationsModal = useRef('')

    const _logout=()=>{
        dispatch(logout())
        window.location.assign('/')
    }
    useEffect(() => {
        setTimeout(() => {
            if(window.location.hash.includes('boards')){
                setActiveBtn('workspaces')
            }
        }, 0);
    }, [])


    useEffect(() => {
        if(isShown&&notificationsModal&&notificationsModal.current){
            notificationsModal.current.focus()
        }
    }, [isShown])

    return (
        <div className="navbar-section">
            <div className="navbar-first-area">
           
            {/* <input onChange={onUploadImg} type="file"/> */}
            
   
                <div className="logo upload-img-wrapper">
                    <UploadImg itemName='logo'/>
                </div>
                <Link to={`/boards`} >
                    <div 
                    className={`icon-wrapper ${activeBtn==='workspaces'?'selected':''}`}
                    onClick={()=>{ 
                        setActiveBtn('workspaces')
                    }} 
                    >
                        <BsGrid className='navbar-icon'/>
                        <span className="label-text">Wrokspaces</span>
                    </div>
                </Link>
                <div 
                className={`icon-wrapper ${isShown?'selected':''} `}
                onClick={()=>{setShowModal(true)}} 
                >
                    <IoMdNotificationsOutline className={`navbar-icon`}/>
                    {!isShown&&<span className="label-text">Notifications</span>}

                    {isShown&&
                    <div
                    className="modal-default-style notifications-modal"
                    tabIndex="0"
                    ref={notificationsModal}
                    onBlur={()=>setShowModal(false)}
                    >
                        <NotificationsModal/>
                    </div>}
                </div>
                <div 
                className={`icon-wrapper ${activeBtn==='downloads'?'selected':''}`} 
                onClick={()=>{setActiveBtn('downloads')}} 
                >
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M11.443 6.365L8.071 9.739m0 0L4.699 6.366M8.07 9.738V.667" stroke="rgb(233, 233, 233)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4.95 11.333l.554-.23a.6.6 0 0 0-.554-.37v.6zm6.1 0v-.6a.6.6 0 0 0-.554.37l.554.23zm-6.1-.6H1.199v1.2h3.75v-1.2zm-3.751 0a1.13 1.13 0 0 0-1.132 1.133h1.2a.07.07 0 0 1-.068.067v-1.2zM.067 11.866v3.145h1.2v-3.145h-1.2zm0 3.145a1.13 1.13 0 0 0 1.132 1.132v-1.2a.07.07 0 0 1 .068.068h-1.2zm1.132 1.132H14.8v-1.2H1.199v1.2zm13.602 0a1.13 1.13 0 0 0 1.132-1.132h-1.2a.07.07 0 0 1 .068-.068v1.2zm1.132-1.132v-3.145h-1.2v3.145h1.2zm0-3.145a1.13 1.13 0 0 0-1.132-1.133v1.2a.07.07 0 0 1-.068-.067h1.2zm-1.132-1.133H11.05v1.2H14.8v-1.2zm-4.305.37c-.408.98-1.349 1.63-2.496 1.63v1.2c1.627 0 3.008-.938 3.604-2.369l-1.108-.461zM8 12.733c-1.147 0-2.089-.65-2.496-1.63l-1.108.461c.596 1.431 1.976 2.37 3.604 2.37v-1.2z" fill="rgb(233, 233, 233)"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath></defs></svg>
                    <span className="label-text">text text text</span>
                </div>
            </div>
            <div className="navbar-second-area">
                <div 
                className={`icon-wrapper ${activeBtn==='my week'?'selected':''}`} 
                onClick={()=>{setActiveBtn('my week')}} 
                >
                    <svg width="22" height="22" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M177.23 32.224V7.16a7.16 7.16 0 0 1 14.322 0v25.063h41.175c12.849 0 23.273 10.424 23.273 23.273v80.559a7.16 7.16 0 0 1-14.322 0V94.88H14.322v137.846c0 4.94 4.012 8.951 8.95 8.951h96.672a7.16 7.16 0 0 1 0 14.322H23.273C10.424 256 0 245.576 0 232.727V55.497c0-12.85 10.424-23.273 23.273-23.273h41.175V7.16a7.16 7.16 0 0 1 14.321 0v25.063h98.462zm64.448 48.335V55.497c0-4.94-4.012-8.952-8.95-8.952H23.272c-4.94 0-8.951 4.013-8.951 8.952v25.062h227.356zm2.098 98.77a7.16 7.16 0 0 1 10.127 10.126l-64.448 64.448a7.16 7.16 0 0 1-10.127 0l-32.224-32.224a7.16 7.16 0 0 1 10.127-10.127l27.16 27.16 59.385-59.384z" fill="rgb(233, 233, 233)" fillRule="nonzero"></path></svg>
                    <span className="label-text">My Week</span>
                </div>
                <div 
                className={`icon-wrapper ${activeBtn==='add user'?'selected':''}`}
                onClick={()=>{setActiveBtn('add user')}} 
                >
                    <AiOutlineUserAdd className={`navbar-icon`} />
                    <span className="label-text">text text text</span>
                </div>
                <div 
                className={`icon-wrapper ${activeBtn==='search'?'selected':''}`}
                onClick={()=>{setActiveBtn('search')}} 
                >
                    <IoIosSearch className={`navbar-icon`}/>
                    <span className="label-text">text text text</span>
                </div>
                <div 
                className={`icon-wrapper ${activeBtn==='help'?'selected':''}`}
                onClick={()=>{setActiveBtn('help')}} 
                >
                    <svg stroke="rgb(233, 233, 233)" width="22" height="22" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="icon" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="rgb(233, 233, 233)" strokeWidth="2" d="M12,23 C12.5522847,23 13,22.5522847 13,22 C13,21.4477153 12.5522847,21 12,21 C11.4477153,21 11,21.4477153 11,22 C11,22.5522847 11.4477153,23 12,23 Z M12,18 L12,15 C12,13 13,13 15,12 C17,11 18,9.15767339 18,7 C18,3.6862915 15.3137085,1 12,1 C8.6862915,1 6,3.6862915 6,7"></path></svg>
                    <span className="label-text">text text text</span>
                </div>
                <div className="avatar-image-wrapper" 
                    tabIndex='0' onBlur={()=>{setIsOpenModal(false)}}
                >
                    <div 
                    className="avatar-image-border" 
                    onClick={()=>{setIsOpenModal(curr=>!curr)}}
                    >
                        {/* <AiOutlineUser className="AiOutlineUser" style={{ width: '34px', height: '34px' }}/> */}
                        {loggedInUser&&<div className="user-avatar" style={{backgroundImage: `url(${loggedInUser.avatar})`}}></div> }

                    </div>
                    {isOpenModal&&<div className='modal-default-style user-modal-wrapper'>
                            <div className='modal-btn' onClick={()=>
                                {
                                    history.push(`/users/${loggedInUser._id}`)
                                    setActiveBtn(null)
                                    setIsOpenModal(false)
                                }}
                            >
                                <FaRegUser/>
                                <span>Update Profile</span>
                            </div>
                            <div className='modal-btn' onClick={_logout}>
                                <FiLogOut/>
                                <span>Logout</span>
                            </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
