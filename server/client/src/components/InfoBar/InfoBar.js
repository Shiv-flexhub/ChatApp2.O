import React from "react";
import './InforBar.css'
import closeIcon from '../../Icons/closeIcon.png'
import onlineIcon from '../../Icons/onlineIcon.png'


const InforBar = ({room}) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <img src={onlineIcon} className="onlineIcon" alt="online"/>
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/"><img src={closeIcon} alt="close"/></a>
        </div>
    </div>
)

export default InforBar;