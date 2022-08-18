import React, { useState, useEffect } from 'react'
import { useAppDispatch } from "../redux/hooks.ts"
import { setDate } from "../redux/slice/confirmSlice";
import { setObjectDateHook } from "../redux/slice/booking";
import TextField from '@mui/material/TextField';

const DatePickerComponent = () => {
    const color = "#fff"
    const dispatch = useAppDispatch()
    const [date, setDateFunc] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        dispatch(setObjectDateHook(new Date()))
        dispatch(setDate(date))
    })

    const onChange = (selectedDate) => {
        const currentDate = selectedDate;
        setDateFunc(currentDate);
        dispatch(setObjectDateHook(currentDate))
    };

    return (
        <div>
            <TextField
                id="date"
                type="date"
                defaultValue={date}
                sx={{ width: 220,
                        input: {color},
                        label: {color},
                        svg: "#fff",
                        border: "1px solid #fff",
                        borderRadius: "5px"
                }}
                inputProps={{ min: new Date().toLocaleDateString().split('.').reverse().join('-') }}
                onChange={(e) => {
                    onChange((e.target.value).split('-').reverse().join('.'))
                }}
            />
        </div>
    )
}

export default DatePickerComponent