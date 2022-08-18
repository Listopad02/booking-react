import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch} from "../redux/hooks.ts";
import { setOrders } from '../redux/slice/map'
import FreeTimeLine from './FreeTimeLine';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/api";
import { setFree } from '../redux/slice/booking';

const WholeTimeLine = () => {
    const reduxDate = useAppSelector(state => state.confirm.date)
    const tableId = useAppSelector(state => state.map.tableId)
    const orders = useAppSelector(state => state.map.orders)
    const deviceWidth = window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9;
    const booking = useAppSelector(state => state.booking)
    const obj = useAppSelector(state => state.map.object)
    const bookingDB = useAppSelector(state => state.bookingDB.book)
    const settings = useAppSelector(state => state.map.settings)
    const dispatch = useAppDispatch()
    const ordersCollectionRef = collection(db, 'future')

    useEffect(() => {
    const getOrders = async () => {
        const data = await ( getDocs(ordersCollectionRef))
        dispatch(setOrders(data.docs.map(doc => ({...doc.data(), id: doc.id}))))
    }
    getOrders()
    }, [])

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    const d = new Date();
    const n = d.getDay();
    let setting = {};
    let today = 0;
    if (tableId !== 0) {
      for (let key of Object.keys(settings)) {
        if (settings[key].type === 'time') {
          setting = settings[key][obj.timeSettingsType]
          today = setting.timetable[days[n]]
        }
      } 
    }

    let busy = [];
    
    if (orders) {
      busy = Object.values(orders)
        .map((e) => {
          if (e.objectId === tableId && e.date === reduxDate) {
            return e
          }
        })
        .filter(Boolean)
        .filter((e) => {
          if (e.date === reduxDate && e.status !== "cancel") return e;
        })
        .map((e) => {
          return [e.startTime, e.endTime];
        });
    }

    function sortEggsInNest(a, b) {
      if (a[0] > b[0]) {
        return 1;
      } else if (b[0] > a[0]) {
        return -1;
      } else {
        return 0;
      }
    }
    busy.sort(sortEggsInNest);

    let advanceFree = [];    
    
    if (today) {
      let currentTime;
      busy.map((e, i) => {
        if (today.startWorkTime === e[0] && busy.length === 1) {
          advanceFree.push([e[1], today.startWorkTime + today.workTimeDuration]);
          return;
        }
        if (e[0] < today.startWorkTime + setting.minBookingDuration) {
          currentTime = e[1];
        }
        if (!currentTime) {
          advanceFree.push([today.startWorkTime, e[0]]);
          currentTime = e[1];
        } else {
          advanceFree.push([currentTime, e[0]]);
          currentTime = e[1];
        }
        if (
          i + 1 === busy.length &&
          currentTime < today.startWorkTime + today.workTimeDuration
        ) {
          advanceFree.push([
            currentTime,
            today.startWorkTime + today.workTimeDuration,
          ]);
        }
      });
      if (busy.length < 1) {
        advanceFree.push([
          today.startWorkTime,
          today.startWorkTime + today.workTimeDuration,
        ]);
      }
    }

    const freee = advanceFree.map((e) => {
      if (
        e[0] === today.startWorkTime &&
        e[1] < today.startWorkTime + today.workTimeDuration
      ) {
        return [e[0], e[1] - setting.breakDuration];
      } else if (
        e[1] === today.startWorkTime + today.workTimeDuration &&
        e[0] > today.startWorkTime
      ) {
        return [e[0] + setting.breakDuration, e[1]];
      } else if (
        e[0] === today.startWorkTime &&
        e[1] === today.startWorkTime + today.workTimeDuration
      ) {
        return [e[0], e[1]];
      } else {
        return [e[0] + setting.breakDuration, e[1] - setting.breakDuration];
      }
    });
    const free = freee.filter((e) => {
      if (e[1] - e[0] >= setting.minBookingDuration) return e;
    });
    
    useEffect(() => {
      dispatch(setFree(free));
    }, [bookingDB, booking.id]);

    const styles = {
      container: {
        alignItems: 'center',
      },
      lineContainer: {
    
      },
      text: {
          color: "#fff",
          marginTop: 30,
          textAlign: 'center'
      },
      green: {
          color: '#189c15'
      }
    }
  
    return (
        <div style={styles.container}>
          <div style={{
              display: 'flex',
              flexDirection: 'row',
              width: window.innerWidth >= 600 ? 600 : window.innerWidth * 0.9,
              justifyContent: free.length > 1 ? 'space-around' : 'center',
              position: 'relative',
          }}>
            { 
                free.map((e, i) => {
                    return (
                        <FreeTimeLine
                            key={i}
                            widthContent={deviceWidth}
                            free={e}
                            start={today.startWorkTime}
                            end={today.startWorkTime + today.workTimeDuration}
                        />
                    )
                })
            }
            </div>
            <p style={styles.text}>Выберите столик чтобы узнать &nbsp;
                <span style={styles.green}>свободное</span> время.
            </p>
        </div>
    )
}

export default WholeTimeLine