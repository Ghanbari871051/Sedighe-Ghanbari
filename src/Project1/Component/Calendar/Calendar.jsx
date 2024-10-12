import React, { useEffect, useState, useRef } from 'react';
import './CalendarStyle.scss'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar as Taghvim } from "react-modern-calendar-datepicker";

const Calendar = ({ type, dir, margin, ChangeDate }) => {
    // https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/getting-started
    //type is fa or en
    const [selectedDay, setSelectedDay] = useState(null);
    const [FlagShow, setFlagShow] = useState(false);
    const taghvimRef = useRef(null); // Create a ref for the .taghvim div

    useEffect(() => {
        console.log(50, selectedDay);
        if (selectedDay !== null) {
            const year = selectedDay.year;
            const month = selectedDay.month < 10 ? `0${selectedDay.month}` : selectedDay.month;
            const day = selectedDay.day < 10 ? `0${selectedDay.day}` : selectedDay.day;
            // Format the date as yyyy/mm/dd
            const formattedDate = `${year}/${month}/${day}`;
            ChangeDate(formattedDate)
        }
        else {
            ChangeDate('')
        }
    }, [selectedDay, type]);

    const [isBottom, setIsBottom] = useState(false);

    useEffect(() => {

        const threshold = 350;

        const divRect = taghvimRef.current.getBoundingClientRect();
        const distanceToBottom = window.innerHeight - divRect.bottom;

        // console.log(distanceToBottom,threshold);


        setIsBottom(distanceToBottom > threshold ? true : false);
        //  console.log(8,taghvimRef.current.offsetHeight,window.innerHeight);
        const handleResize = () => {
            //   console.log(9,taghvimRef);
            const divHeight = taghvimRef.current.offsetHeight; // Use ref to get the height
            const windowHeight = window.innerHeight;

            // Adjust the threshold as needed



        };

        // Initial check
        handleResize();

        // Attach resize event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [FlagShow]);


    return (
        <div className='calendar-component' style={{ margin: `${margin}` }}>
            <div className='taghvim-textbox'>  <input ref={taghvimRef} onClick={() => setFlagShow(!FlagShow)} type='text' value={selectedDay !== null ? `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}` : ''}>
            </input>
                <i className='fa fa-remove close' onClick={() => {  setFlagShow(true);setSelectedDay(null); }}></i>
            </div>
            <div className='taghvim' dir={dir} style={{ display: FlagShow ? '' : 'none', ...(isBottom ? { top: '30px' } : { bottom: '30px' }) }}>
                <Taghvim
                    value={selectedDay}
                    onChange={setSelectedDay}
                    shouldHighlightWeekends
                    locale={type ? type : "en"}
                />
            </div>
        </div>
    );
};

export default Calendar;
