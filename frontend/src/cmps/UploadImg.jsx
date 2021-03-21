import React, { useEffect,useState } from 'react';
import { cloudinaryService } from '../services/cloudinarySerivice';
import { useDispatch, useSelector } from "react-redux";
import { updateUser} from '../store/actions/userActions'
import { ImUserPlus } from "react-icons/im";

export function UploadImg({itemName}){
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [img, setImg] = useState(itemName==='logo'?
    'https://res.cloudinary.com/dzvebcsrp/image/upload/v1616327732/logo_xw7dyu.ico':loggedInUser.avatar
    )
    const dispatch = useDispatch();

    useEffect(() => {
       if(itemName==='logo'&&loggedInUser&&loggedInUser.logoImg){
        setImg(loggedInUser.logoImg)
       }
       if(itemName==='user'&&loggedInUser&&loggedInUser.avatar){
        setImg(loggedInUser.avatar)
       }
    }, [loggedInUser,itemName])



    const onUploadImg = async (ev) => {//make costume hook!!!!!!
        ev.preventDefault()
        const cloudImg = await cloudinaryService.uploadImg(ev)
        const imgUrl = cloudImg.secure_url
        if(imgUrl){
            setImg(imgUrl)
           if( itemName==='logo'){
                const newUser= {
                    ...loggedInUser,
                    logoImg:imgUrl
                }
                dispatch(updateUser(newUser))
           }
           if( itemName==='user'){
                const newUser= {
                    ...loggedInUser,
                    avatar:imgUrl
                }
                dispatch(updateUser(newUser))
            }
        }
    }
   
    return (
        <form>
            <label>
                <input onChange={onUploadImg} type="file"/>
                <div style={{backgroundImage: `url(${img})`}}>
                    {itemName==='user'&&<div className="before">
                            <ImUserPlus className='update-img-icon'/>
                            <div className="text">Change profile picture</div>
                    </div>}
                </div>
            </label>
        </form>
    )
}