import React from 'react'
import {setClearArr, setStarts} from "../redux/slice/confirmSlice";
import {useAppDispatch} from "../redux/hooks.ts";
import { Link } from 'react-router-dom';

const Success = () => {
    const dispatch = useAppDispatch()
    const styles = {
      container: {
        position: 'absolute',
        top: "40%",
        backgroundColor: '#222',
        width: '100%',
        // height: '100%',
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center"
      },
      primary: {
          fontSize: 18,
          color: "#fff"
      },
      secondary: {
          fontSize: 14,
          color: "#ccc",
          textDecorationLine: "underline"
      },
        btn: {
            border: 'none',
            background: 'none'

        }
    }
  return (
    <div style={styles.container}>
        <p style={styles.primary}>Оплата произведена успешно!</p>
        <p style={styles.primary}>Ваш стол забронирован</p>
        <button
            style={styles.btn}
            onClick={() => {
                dispatch(setClearArr())
                dispatch(setStarts(1))
            }}
        >
          <Link to="/">
            <p style={styles.secondary}>На главную</p>
          </Link>
        </button>
    </div>
  )
}

export default Success