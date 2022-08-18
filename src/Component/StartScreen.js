import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import {deleteMap, setSettings, clearTableId, setObject, setTableId} from "../redux/slice/map";
import { setDeleteState, setStarts } from "../redux/slice/confirmSlice";
import { resetBooking } from "../redux/slice/booking";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/api";
import { useLocation, Link } from "react-router-dom";
import '../styles/startScreen.css'

import one from '../images/1.jpg'
import two from '../images/2.jpg'
import three from '../images/3.jpg'
const StartScreen = () => {
    const dispatch = useAppDispatch();
    let location = useLocation()
    const start = useAppSelector(state => state.confirm.start)
    const tableId = useAppSelector(state => state.map.tableId)
    useEffect(() => {
        if(location.pathname === '/') {
            console.log('pathname = /')
            dispatch(deleteMap())
            dispatch(setDeleteState())
            dispatch(resetBooking())
            dispatch(clearTableId())
            console.log(tableId, 'tableId')
            console.log(tableId !== 0, '!== 0')
        }
    }, [])

    useEffect(() => {
        if (start === 1) {
            dispatch(setObject(null))
            dispatch(setStarts(0))
            dispatch(setTableId(0))
            dispatch(deleteMap())
            dispatch(setDeleteState())
            dispatch(resetBooking())
        }
    }, [start])


    const settingsCollectionRef = collection(db, 'settings')

    useEffect(() => {
        const getSetting = async () => {
            const data = await ( getDocs(settingsCollectionRef))
            dispatch(setSettings(data.docs.map(doc => ({...doc.data(), id: doc.id}))))
        }
        getSetting()
    }, [])
    return (
        <div style={styles.container} >
            <div style={styles.box}>
                <p className='text'>SMARTBOOKING</p>

                <div style={styles.boxLink}>
                    <Link
                        style={styles.btn}
                        to='billiards'
                    >
                        <img src={one}
                             className='image'
                             style={{ marginRight: 5 }}
                             alt='Бильярд'
                        />
                    </Link>
                    <Link
                        style={styles.btn}
                        to='/karaoke'
                    >
                        <img
                            alt="Караоке"
                            className='image'
                            style={{ marginLeft: 5 }}
                            src={two} />
                    </Link>
                </div>
                <Link
                    style={styles.btnPs}
                    to='/playstation'

                >
                    <img alt='playstation'  className='imagePs' src={three} />
                </Link>
            </div>
        </div>
    )
}

const styles = {
    text: {
        color: 'white',
        fontSize: 40,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        backgroundColor: '#222',
        width: '100%',
        height: '100%',
        paddingTop: 100,
        margin: 'auto',
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    boxLink: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        marginBottom: 20,

    },
    btn: {
        background: 'none',
        padding: 0,
        border: 'none',
        // margin: '0 auto',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
    },
    btnPs: {
        background: 'none',
        padding: 0,
        border: 'none',
        margin: '0 auto',
        cursor: 'pointer'
    },
    image: {

    }
}

export default StartScreen