import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { setTableId, setObject } from "../redux/slice/map";
import { setObjectIDHook } from "../redux/slice/booking"
import '../styles/map.css'
function ObjectMap({ object }) {
   const coefficientSize = useAppSelector(state => state.map.coefficientSize)
   const dispatch = useAppDispatch()
   const tableId = useAppSelector(state => state.map.tableId)
   const target = () => {
     if( object.type !== 'static') {
         dispatch(setTableId(object.id))
         dispatch(setObject(object))
         dispatch(setObjectIDHook(object.id))
         setPress(!press)
     }
   }
    const [press, setPress] = useState(false)

  return (
    <button style={{
        width: object.location.width * coefficientSize,
        height: object.location.height * coefficientSize,
        top: object.location.startY * coefficientSize,
        left: object.location.startX * coefficientSize,
        backgroundColor: tableId === object.id ? "#189c15" : "#303030",
        borderRadius: 10,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    }}
      onClick={() => {
          target()
      }}
    >
        <p className='text-name' >{object.name}</p>
        {object.guestCapacity && <p style={{ color: 'white', fontSize: 19,  margin: '5px auto 0 auto' }}>Мест: {object.guestCapacity}</p>}
    </button>
  );
}



export default ObjectMap
