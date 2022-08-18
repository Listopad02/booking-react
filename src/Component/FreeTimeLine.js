import { enableIndexedDbPersistence } from 'firebase/firestore';
import React from 'react'

const FreeTimeLine = ({ widthContent, free, start, end }) => {
    console.log('width', ((free[1] - free[0]) / (end - start)) * widthContent)
    
    const objectStyle = {
        position: 'relative',
        marginTop: 32,
        marginRight: 20,
        height: 5,
        backgroundColor: "#189c15",
        width: ((free[1] - free[0]) / (end - start)) * widthContent,
    };
    const objectStyle1 = {
        position: 'absolute',
        bottom: 10,
        color: "#fff"
    };
    const objectStyle2 = {
        position: 'absolute',
        top: 10,
        left: ((free[1] - free[0]) / (end - start)) * widthContent - 40,
        color: "#fff"
    };
    console.log(free, 'free')
    console.log(((free[1] - free[0]) / (end - start)) * widthContent, 'left')
    console.log(end, 'end')
    console.log(start, 'start')
    console.log(widthContent, 'widthContent')
    function getTimeFromMins(mins) {
        let hours = Math.trunc(mins / 60);
        let minutes = mins % 60;
        if (minutes === 0) minutes = "00";
        if (hours >= 24) hours -= 24;
        return hours + ":" + minutes;
    }
    
    return (
        <div style={{ marginLeft: 20 }}>
            <div style={objectStyle}>
                <div style={objectStyle1}>
                    {getTimeFromMins(free[0])}
                </div>
                <div style={objectStyle2}>
                    {getTimeFromMins(free[1])}
                </div>
            </div>
        </div>
  )
}

export default FreeTimeLine