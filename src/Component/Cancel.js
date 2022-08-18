import React from 'react'

const Success = ({ navigation }) => {

  const styles = {
    container: {
      backgroundColor: '#222',
      width: '100%',
      height: '100%',
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
        <p style={styles.primary}>Оплата была отменена</p>
        <button style={ styles.btn }>
            <p style={styles.secondary}>На главную</p>
        </button>
    </div>
  )
}

export default Success