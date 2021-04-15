import React, { useEffect,useState,useRef,forwardRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export function TaskDate({task,taskKey,onEditTask,table}) {
    const [startDate, setStartDate] = useState(task.createdAt?new Date(task.createdAt):new Date());

    useEffect(() => {
        const updatedTask = {
            ...task,
            createdAt: startDate.getTime()
        }
        const desc = `changed date inside "${task.name}" `
        onEditTask(table,updatedTask,desc)
    }, [startDate])

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

    const getDateValue=(value)=>{
      let dayNum =value.substr(0,3)
      let monthNum = parseInt(value.substr(3))
      if(monthNum<10){
        monthNum = parseInt(value.substr(4))
      }
      if(value.substr(0,1)==="0"){
        dayNum = value.substr(1,2)
      }
      const month = getMonthName(monthNum)
      return dayNum+month
    }

    const ExampleCustomInput = forwardRef(
      ({ value, onClick }, ref) => (
        <button className="custom-date-input" onClick={onClick} ref={ref}>
          {getDateValue(value)}
        </button>
      ),
    );

    return (
        <DatePicker
        className="task-date-picker"
        dateFormat="dd MM"
        selected={startDate}
        onChange={date => setStartDate(date)}
        customInput={<ExampleCustomInput />}
        />
    )
}