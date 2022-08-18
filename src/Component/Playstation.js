import React, {useEffect, useState} from 'react'
import Map from './Map';
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { setPage } from "../redux/slice/confirmSlice";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../api/api";
import {setCoefficientSize, setMap} from "../redux/slice/map";
import ObjectMap from "./ObjectMap";
import WholeTimeLine from './WholeTimeLine';
import Loader from "./Loader";
import { setLoading } from "../redux/slice/bookingDB";
import CircularProgress from "@mui/material/CircularProgress";

const Playstation = () => {
    let deviceWidth = window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9;
    const dispatch = useAppDispatch()
    const userCollectionRef = collection(db, 'developMap')
    const loading = useAppSelector(state => state.bookingDB.loading)
    const [maps, setMaps] = useState({})
    useEffect(() => {
        dispatch(setPage('billiards'))
    })

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
            .catch(err => {
                console.log(err)
            })
    }, [])


    let arr = Array.from(maps)

    const addTableBR = () => {
        dispatch(setLoading(true))
        const res = []
        arr.map(el => {
            if (el.config.id === 'main_hall') {
                res.push(el)
            }
        })
        res.map(el => {
            const arr2 = el.config.objects
            for( let key of Object.keys(arr2)) {
                // res2.push(arr2[key])
                dispatch(setMap(arr2[key]))
                dispatch(setLoading(false))
            }
            dispatch(setCoefficientSize(deviceWidth / el.config.mapWidth))
        })
    }

    useEffect(() => {
        addTableBR()
    }, [maps])


    useEffect(() => {
        dispatch(setPage('playstation'))
    })

    const styles = {
      container: {
        backgroundColor: '#222',
        width: '100%',
        height: '100%',
        paddingTop: 100,
        display: 'flex',
        alignItems: "center",
        flexDirection: 'column',
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
            <h2 style={styles.header}>PLAYSTATION</h2>
            <Map />
            <WholeTimeLine />
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
                    marginTop: 30
                }}>
                    {map.map((e, i) => {
                        if (e.type !== 'billiards') {
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

export default Playstation