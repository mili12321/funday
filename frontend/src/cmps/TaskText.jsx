import React, { useEffect,useState,useRef } from 'react';
import { stickers } from '../data/stickers'
import { FaRegSmile} from 'react-icons/fa'

export function TaskText({onEditTask,table,task,setUpdatingText}){
    const [text, setText] = useState('');
    const [isUpdating, setUpdateText] = useState(false);
    const [isShowModal, setShowModal] = useState(false);
    const inputRef = useRef()

    useEffect(() => {
        if(task.text){
            setText(task.text)
        }
    }, [task])

    const onUpdating=()=>{
        setUpdateText(true)
        setUpdatingText(true)
        setTimeout(() => {
            inputRef.current.focus()
           }, 0);
    }

    const replaceWithSticker=(sticker)=>{
        let result = sticker
        stickers.forEach((em) => {
            let emoji=''
            switch (em.customCategory) {
                case 'FA':
                    emoji = `<i class='${em.img} ${em.class}'></i>`
                    break;
                case 'Gif':
                    emoji = `
                    <img src=${em.imageUrl} className='gif-img'></img>
                    ` 
                    break;
                default:
                    break;
            }
            let temp = ''
            while (result !== temp) {
              temp = result
              const searchStr = em.name
              result = result.replace(searchStr,emoji)
            }
        })
        return result
    }

    return (
        <div
         className="task-text" onClick={onUpdating}
        //  tabIndex="0"
        //  onBlur={()=>setUpdateText(false)}
         >
            {isUpdating?
                <div className="updating-container">
                    <input 
                    type="text" 
                    onChange={(e)=>setText(e.target.value)} 
                    value={text}
                    onBlur={()=>
                        {
                            const updatedTask = {
                                ...task,
                                text: text
                            }
                            const desc = `changed task "${task.name}" text to "${text}"`
                            onEditTask(table,updatedTask,desc)
                            setUpdateText(false)
                            setShowModal(false)
                            setUpdatingText(false)
                        }
                    }
                    ref={inputRef}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.target.blur()
                        }
                    }}
                    />
                    <span className={`${isShowModal?'active':''}`}>
                        <FaRegSmile onClick={()=>setShowModal(curr=>!curr)}/>
                        {
                            isShowModal&&<div className='modal-default-style text-modal'>
                                {stickers.map(sticker=>
                                    <span 
                                    onClick={()=>setText(curr=>curr+' '+sticker.name)}> 
                                    {
                                        sticker.customCategory==='FA'?
                                        <i class={`${sticker.img} ${sticker.class} gif-img`}></i>
                                        :
                                        <img src={`${sticker.imageUrl}`} className='gif-img' alt=''></img>
                                    }
                                    </span>
                                )}
                            </div>
                        }
                    </span>
                </div>
                    :
                <div className="text-content">
                     <span className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{__html: replaceWithSticker(text),}}></span>
                </div>
            }
        </div>
    )
}