import React, {useEffect, useState} from 'react'
import DatePickerComponent from './DatePickerComponent';
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";
import {setClearArr, setPrice, setRes, setResPrice, setStarts, setTable} from "../redux/slice/confirmSlice";
import { deleteMap } from '../redux/slice/map';
import { setDeleteState } from '../redux/slice/confirmSlice'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";
import { Link } from 'react-router-dom';
import '../styles/map.css'
import { createBrowserHistory } from "history";

const Map = () => {
    const history = createBrowserHistory()
    const cellId = useAppSelector(state => state.map.tableId)
    const dispatch = useAppDispatch()
    const settings = useAppSelector(state => state.map.settings)
    const obj = useAppSelector(state =>  state.map.object)
    const resPrice = useAppSelector(state => state.confirm.resPrice)
    const res = useAppSelector(state => state.confirm.res)
    const [open, setOpen] = useState(false)

    const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ]

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpen(false);
    };

    const handleDays = () => {
        const day = new Date().getDay();
        return days[day]
    }
    const addPrice = () => {
        if (settings.length > 0) {settings.map(el => {
            if(el.type === 'price') {
                dispatch(setResPrice(el))
            }
        })
        const d = handleDays()
        if(obj !== null) {
            for (let key of Object.keys(resPrice)) {
                if(obj.priceSettingsType === key) {
                    dispatch(setRes(resPrice[key]))
                }
            }

            for (let key of Object.keys(res) ) {
                if(d === key) {
                    dispatch(setPrice(res[key]))
                }
            }
        }} else {
            history.back()
        }
    }

    useEffect(() => {
        addPrice()
        dispatch(setClearArr())
    }, [obj])

    const styles = {
        container: {
            display: 'flex',
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },

        calendar: {
            borderWidth: 1,
            borderColor: "#fff",
            borderRadius: 20,
            padding: 10,
            color: "#fff",
            background: 'none',
        },
        text: {
            color: "#fff",
            textDecoration: 'none',
            margin: 0,
        }
    }

  return (
    <div style={styles.container}>
        <Link className='buttonBack'
              to='/'
              onClick={() => {
                    dispatch(setClearArr())
                    dispatch(setStarts(1))
                    dispatch(deleteMap())
        }}>
            <p style={styles.text}>Назад</p>
        </Link>
        <div>
            <DatePickerComponent />
        </div>
        {
            cellId !== 0 ?
            <Link className='buttonNext' to='/confirm'>
                <p style={styles.text}>Далее</p>
            </Link> : 
            <Link className='buttonNext' to='/confirm' onClick={ event => {
                    event.preventDefault()
                    handleClick()
                }}>
                <p style={styles.text}>Далее</p>
            </Link>
        }
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                Выберите столик!
            </Alert>
        </Snackbar>
    </div>
  )
}

export default Map