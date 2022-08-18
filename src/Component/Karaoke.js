import React, {useEffect, useState} from 'react'
import Map from './Map';
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { setPage } from "../redux/slice/confirmSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/api";
import { deleteMap, setCoefficientSize, setMap } from '../redux/slice/map'
import ObjectMap from './ObjectMap';
import WholeTimeLine from './WholeTimeLine';
import Loader from "./Loader";
import { setLoading } from "../redux/slice/bookingDB";
import CircularProgress from '@mui/material/CircularProgress';

const Karaoke = ({ tableId }) => {
    let deviceWidth = window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9;
    const userCollectionRef = collection(db, 'developMap')
    const dispatch = useAppDispatch()
    const [selectedTable, setSelectedTable] = useState(tableId)
    const [floor, setFloor] = useState(1)
    const [maps, setMaps] = useState({})
    const loading = useAppSelector(state => state.bookingDB.loading)
    useEffect(() => {
        dispatch(setPage('karaoke'))
    })

    const handleFloor = (floor) => {
        setFloor(floor)
    }
    console.log(floor, 'floor')
    const map = useAppSelector(state => state.map.map) 

    useEffect(() => {
        const getMap = async () => {
            const data = await ( getDocs(userCollectionRef))
            setMaps(data.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        getMap()
            .then(() => {
                dispatch(setLoading(true))
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    let arr = Array.from(maps)
    const addTableBR = () => {
        dispatch(setLoading(true))
        const res = []
        const a = floor === 1 ? 'karaoke_first_floor' : 'karaoke_second_floor'
        dispatch(deleteMap())
        arr.map(el => {
            if (el.id === a) {
                res.push(el)
            }
        })
        res.map(el => {
            const arr2 = el.objects
            for (let key of Object.keys(arr2)) {
                dispatch(setMap(arr2[key]))
                dispatch(setLoading(false))
            }
            dispatch(setCoefficientSize(deviceWidth / el.config.mapWidth))
        })
    }

    useEffect(() => {
        addTableBR()
    }, [maps, floor])

    const styles = {
        container: {
            backgroundColor: '#222',
            width: '100%',
            height: '100%',
            paddingTop: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            paddingBottom: '50px'
        },
        header: {
            textAlign: "center",
            color: "#fff",
            fontSize: 25,
            // paddingBottom: 55
        },
        text: {
            color: "#fff",
            marginTop: 30
        },
        green: {
            color: '#189c15'
        }
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>KARAOKE</h2>
            <Map />
            <WholeTimeLine />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                <p style={{ color: 'white', marginRight: 10, fontSize: 22  }}>Этаж</p>
                <button style={{
                    border: floor !== 1 ? '1px solid white' : 'none',
                    background: floor !== 1 ? 'none' : 'rgb(24, 156, 21)',
                    borderRadius: '50%',
                    padding: '8px 6px',
                    marginRight: 20,
                    cursor: 'pointer'
                }}
                onClick={() => {
                    handleFloor(1)
                }}
                >
                    <p style={{ color: 'white', width: '30px', fontSize: 20, margin: 0 }}>1</p>
                </button>
                <button style={{
                    border: floor !== 2 ? '1px solid white' : 'none',
                    background: floor !== 2 ? 'none' : 'rgb(24, 156, 21)',
                    borderRadius: '50%',
                    padding: '8px 6px',
                    cursor: 'pointer'

                }}
                   onClick={() => {
                       handleFloor(2)
                   }}>
                    <p style={{ color: 'white', width: '30px', fontSize: 20, margin: 0 }}>2</p>
                </button>
            </div>
            {loading ?
                <div style={{ marginTop: '100px' }}>
                    <CircularProgress />
                </div>
                :
                <div style={{
                    width: window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    position: 'relative',
                    marginTop: 30,
                    marginBottom: 50
                }}>
                    {map.map((e, i) => {
                        if (e.type !== 'biliards') {
                            return (
                                <ObjectMap
                                    key={i}
                                    object={e}
                                />
                            );
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default Karaoke