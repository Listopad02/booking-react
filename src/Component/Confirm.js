import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from "../redux/hooks.ts";
import { collection, getDocs, addDoc} from "firebase/firestore";
import { db } from "../api/api";
import { setResArr, setEndResArr, setStarts } from "../redux/slice/confirmSlice";
import '../styles/confirm.css'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";
import { Link } from 'react-router-dom';
import { createBrowserHistory } from "history";

const Confirm = () => {
    const history = createBrowserHistory()
    const regExpValidPhone = /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/
    const dateToday = useAppSelector(state => state.confirm.date)
    const obj = useAppSelector(state => state.map.object)
    const price = useAppSelector(state => state.confirm.price)
    const resArr = useAppSelector(state => state.confirm.resArr)
    const endResArr = useAppSelector(state => state.confirm.endResArr)
    const free = useAppSelector(state => state.booking.free)
    const settings = useAppSelector(state => state.map.settings)

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [open, setOpen] = useState(false)
    const userCollectionRef = collection(db, 'settings')
    const newBookingCollectionRef = collection(db, 'future')

    console.log('phone', phone)

    const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ]
    const dispatch = useAppDispatch()
    
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

    useEffect(() => {
        const getSetting = async () => {
            const data = await ( getDocs(userCollectionRef))
            // setSettings(data.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        getSetting()
    }, [])
    const [reload, setReload] = useState(0)
    let a = 0

    const addTimeToArr = (time) => {
        if(time / 60 < 24) {
            if ( time % 60 === 0 ) {
                return time / 60 + ':00'
            }
            else if (time % 60 !== 0) {
                const q =(time / 60).toString()
                return q.split('.')[0] + ':30'
            }
        }
        else {
            if ( time % 60 === 0 ) {
                return (time / 60) - 24 + ':00'
            }
            else if (time % 60 !== 0) {
                const q =((time / 60) - 24).toString()
                return q.split('.')[0] + ':30'
            }
        }
    }
    const startTime = () => {
        // dispatch(setClearArr())
        setReload(reload + 1)
        const d = handleDays()
        const gg = []
        if (settings.length > 0)
        {a = settings.map(el => {
            if(el.type === 'time') {
                return el           
            }
        })
            .filter(Boolean)
            .filter(el => {
                let sTime = 0
                for(let key of Object.keys(el)) {
                    if (key === obj.timeSettingsType) {
                        sTime = el[key].timetable[d]
                    }
                }
                for (let i = sTime.startWorkTime; i <= sTime.startWorkTime + sTime.workTimeDuration - 60; i = i + 30) {
                    gg.push(i)
                }
                free.map(el => {
                    gg.filter(e => {
                        if(el[0] < e && e <= el[1]) {
                            dispatch(setResArr({ label: addTimeToArr(e), value: e }))
                        }
                    })
                })
            })} else {
                dispatch(setStarts(1))
                history.back()
                // history.push('/')
                // window.reload()
            }
    }

    const endTime = () => {
        const datatest = handleDays()
        if (start !== null) {
            a = settings.map(el => {
                if(el.type === 'time') {
                    return el           }
            })
                .filter(Boolean)
                .filter(el => {
                    let sTime = 0
                    for(let key of Object.keys(el)) {
                        if (key === obj.timeSettingsType) {
                            sTime = el[key].timetable[datatest]
                        }
                    }
                    let timeEnd = 0
                    free.forEach((el) => {
                        if (el[0] <= start && start <= el[1]) {
                            timeEnd = el[1];
                        }
                    });
                    for (let i = start + 60; i <= timeEnd; i += 30) {
                        dispatch(setEndResArr({ label: addTimeToArr(i), value: i }))
                    }
                })
        }
    }

    useEffect(() => {
        if (resArr.length === 0 ) {
            startTime()
        }
    }, [obj, resArr])

    useEffect(() => {
        endTime()
    }, [start, reload])

    const postNewBooking = async () => {
        await addDoc(newBookingCollectionRef, {
            actualEndBookingTime: 0,
            actualStartBookingTime: 0,
            date: dateToday.split(',')[0],
            endTime: end,
            name: name,
            objectId: obj.id,
            phone: phone,
            startTime: start,
            status: "new",
            type: obj.type
        })
    }

    // useEffect(() => {
    //     if (obj === null) {
    //         history.push('/')
    //     }
    // }, [])

    const styles = {
        container: {
            backgroundColor: '#222',
            width: '100%',
            height: '100%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        title: {
            color: 'white',
            fontSize: 35,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20
        },
        text: {
            color: 'white',
            fontSize: 25,
            textAlign: "center",
            margin: 'auto',

        },
        select: {
            border: '1px solid white',
            borderRadius: 15,
            width: '300px',
            height: '40px',
            padding: 10
        },
        span: {
            color: 'white',
            textAlign: "center",
            margin: '15px 0 0 0'
        },
        price: {
            color: 'green',
            margin: '15px 0 0 5px'
        },
        btnContainer: {
            display: "flex",
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 40
        },
        textBtn: {
            color: 'white',
            fontSize: 20
        },
        btn: {
            border: '1px solid white',
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            background: 'none',
            margin: '0 20px 0 0',

        }
    }
    console.log(endResArr, 'endResArr')

    return (
        obj !== null && 
        <div style={styles.container}>
            <h2 style={styles.title}>{obj.type !== 'ps' ?  obj.type.toUpperCase() : 'PLAYSTATION 4'}</h2>
            <p style={styles.text}>{dateToday.split(',')[0]}</p>
            <p style={styles.text}>{obj.name}</p>
            <p style={{color: "#fff", margin: '20px 0 15px 0', fontSize: 25}}>Время начала:</p>
            <div className='selectWrapper'>
                <div className="selectArrow" />
                <div className="selectArrow" />
                <select onChange={(e) => {
                    setStart(Number(e.target.value))
                }}>
                    <option value={null}>Выберите время</option>
                    {resArr.map((el, i) => {
                        return(
                            <option
                                key={i + 10}
                                value={el.value}
                            >{el.label}</option>
                        )
                    })}
                </select>
            </div>
            <p style={{color: "#fff", margin: '20px 0 15px 0', fontSize: 25}}>Время окончания:</p>
            <div className='selectWrapper'>
                <div className="selectArrow" />
                <div className="selectArrow" />
                <select
                        onChange={(e) => {
                            setEnd(Number(e.target.value))
                        }}
                >
                    {start !== null && <option value={null}>Выберите время</option>}
                    {endResArr.map((el, i) => {
                        return(
                            <option key={i + 100} value={el.value}>{el.label}</option>
                        )
                    })}
                </select>
            </div>
            <input
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
                placeholder='Имя'
                style={{
                    color: 'white',
                    border: '1px solid white',
                    background: 'none',
                    borderRadius: 15,
                    height: 55,
                    paddingLeft: 10,
                    marginTop: 30,
                    width: 300,
                    fontSize: 25
                }}
            />
            <input
                // value={phone}
                onChange={(e) => {
                    setPhone(e.target.value)
                }}
                placeholder='Телефон'
                style={{
                    color: 'white',
                    border: '1px solid white',
                    background: 'none',
                    borderRadius: 15,
                    height: 55,
                    paddingLeft: 10,
                    marginTop: 20,
                    width: 300,
                    fontSize: 25
                }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <p style={styles.span}>{obj.type !== 'karaoke' ? 'Стоимость 1 часа' : 'Депозит'} - </p>
                <p style={styles.price}>{price} P</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <p style={styles.span}>Услуга бронирования - </p>
                <p style={styles.price}>100P</p>
            </div>
            <div style={styles.btnContainer}>
                <button style={styles.btn}>
                    <Link
                        to='/'
                        onClick={() => {
                            dispatch(setStarts(1))
                        }}
                        style={{ textDecoration: 'none' }}
                    >
                        <p style={styles.textBtn}>Назад</p>
                    </Link>
                </button>
                {
                    regExpValidPhone.test(phone) && name.length >= 3 ?
                    <button style={styles.btn}>
                        <Link to='/success' style={{ textDecoration: 'none' }} onClick={() => {
                            try {
                                postNewBooking()
                            } catch (err) {
                                console.log(err)
                            }
                        }}>
                            <p style={styles.text}>Забронировать</p>
                        </Link>
                    </button> : 
                    <button style={styles.btn}>
                        <Link to='/success' onClick={e => {
                            handleClick()
                            e.preventDefault()
                        }}>
                            <p style={styles.text}>Забронировать</p>
                        </Link>
                    </button>
                }
            </div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    Проверьте Ваши данные!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Confirm