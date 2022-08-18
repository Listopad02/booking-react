import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { setCoefficientSize, setMap } from '../redux/slice/map'
import { setLoading } from "../redux/slice/bookingDB";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/api";
import React, {useEffect, useState} from 'react'
import Map from './Map';
import ObjectMap from './ObjectMap';
import WholeTimeLine from './WholeTimeLine';
import CircularProgress from "@mui/material/CircularProgress";
import { createBrowserHistory } from "history";

const Biliards = () => {
    const history = createBrowserHistory()
    console.log('history', history)
    const deviceWidth = window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9;
    const map = useAppSelector(state => state.map.map) 
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.bookingDB.loading)

    const userCollectionRef = collection(db, 'developMap')
    const [maps, setMaps] = useState({})
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
        const res = []
        dispatch(setLoading(true))
        arr.map(el => {
            if (el.config.id === 'main_hall') {
                res.push(el)
            }
        })
        res.map(el => {
            const arr2 = el.config.objects
            for (let key of Object.keys(arr2)) {
                dispatch(setMap(arr2[key]))
                dispatch(setLoading(false))
            }
            dispatch(setCoefficientSize(deviceWidth / el.config.mapWidth))
        })
    }

    useEffect(() => {
        addTableBR()
    }, [maps])

    const styles = {
      container: {
        backgroundColor: '#222',
        width: '100%',
        height: '100%',
        paddingTop: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center"
      },
      header: {
          textAlign: "center",
          color: "#fff",
          fontSize: 30,
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
                <p style={styles.header}>BILIARDS</p>
                <Map />
                <WholeTimeLine />
            { loading ?
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
                    textAlign: "center"
                }}>
                    {map.map((e, i) => {
                        if (e.type !== 'ps') {
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

export default Biliards