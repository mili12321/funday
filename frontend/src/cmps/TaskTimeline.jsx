import React, { useEffect,useState,useRef } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export function TaskTimeline({task,taskKey,onEditTask,table}) {
    const [startDate, setStartDate] = useState(task.timeline.from?new Date(task.timeline.from):new Date());
    const [endDate, setEndDate] = useState(task.timeline.to?new Date(task.timeline.to):null);
    const [isShown, setIsShown] = useState(false);
    const [timeline, setTimeline] = useState('');
    const [diffDays, setDiffDays] = useState('');
    const [isMouseEnter, setIsmouseEnter] = useState('');

    const onChange = dates => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
        
    function updateTimeline() {
        if(endDate===null){
            let f = new Intl.DateTimeFormat('en');
            let a = f.formatToParts(startDate);
            const day =  a.filter(item=>item.type==="day")[0].value
            const monthNumber =parseInt(a.filter(item=>item.type==="month")[0].value)
            const month = getMonthName(monthNumber)
            setTimeline(`${month} ${day}`)
        }else{
            let f = new Intl.DateTimeFormat('en');
            let a = f.formatToParts(startDate);
            let b = f.formatToParts(endDate);
            const day1 = a.filter(item=>item.type==="day")[0].value
            const day2 = b.filter(item=>item.type==="day")[0].value
            const monthNumber1 = parseInt(a.filter(item=>item.type==="month")[0].value)
            const monthNumber2 = parseInt(b.filter(item=>item.type==="month")[0].value)
            const month1 = getMonthName(monthNumber1)
            const month2 = getMonthName(monthNumber2)
     
            if(month1===month2){
                setTimeline(`${month1} ${day1} - ${day2}`)
            }else{
                setTimeline(`${month1} ${day1} - ${month2} ${day2}`)
            }
        }
        daysBetween(startDate,endDate)
    }

    useEffect(() => {
        if(endDate){
            setTimeline('')

            const updatedTask = {
                ...task,
                timeline: {
                    from : startDate.getTime(),
                    to : endDate.getTime()
                }
            }
            const desc = `added new timeline inside "${task.name}" `
            onEditTask(table,updatedTask,desc)
            updateTimeline()
        }
    }, [endDate])
    

    function daysBetween(startDate,endDate) {
        if(endDate){
            const differenceTime = endDate.getTime()-startDate.getTime();
            setDiffDays(Math.round(differenceTime / (1000 * 3600 * 24))+1)
        }else{
            setDiffDays(1)   
        }
      
    }

    function getMonthName(month){
        switch(month) {
            case 1:
              return 'Jan';
            case 2:
              return 'Feb';
            case 3:
              return 'Mar';
            case 4:
              return 'Apr';
            case 5:
              return 'May';
            case 6:
              return 'June';
            case 7:
              return 'July';
            case 8:
              return 'Aug';
            case 9:
              return 'Sept';
            case 10:
              return 'Oct';
            case 11:
              return 'Nov';
            case 12:
              return 'Dec';
            default:
              return 'foo';
        }
    }

    function removeTimeline() {
        setStartDate(new Date());
        setEndDate(null);
        const updatedTask = {
            ...task,
            timeline: {
                from : '',
                to : ''
            }
        }
        const desc = `removed timeline from "${task.name}" `
        onEditTask(table,updatedTask,desc)
    }


    return (
        <>
        <div className="timeline-task-container" onClick={()=>setIsShown(p=>!p)}
        onMouseEnter={()=>setIsmouseEnter(true)}
        onMouseLeave={()=>setIsmouseEnter(false)}
        >
            <div className={`timeline-content ${task[taskKey].from||task[taskKey].to?'dates':'empty'} ${isShown?'updating':''}`}>
                {(task[taskKey].from||task[taskKey].to)&&<div>
                    {
                        isMouseEnter?diffDays+'d':timeline
                    }
                </div>}
            </div>

            {(task[taskKey].from||task[taskKey].to)&&
                <RiCloseCircleFill className='timeline-delete-btn' onClick={removeTimeline}/>
            }
        </div>

        {isShown&&
            <div className='datePicker-wrapper'>
                <DatePicker
                closeOnScroll={true}
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                />
            </div>
        }

        </>
    )
}