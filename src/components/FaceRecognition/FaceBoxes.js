import React from "react";
import "./FaceBoxes.css"


const FaceBoxes = ({ boxes }) => {
    let uniqueKey = 0;

    // returns an array of divs
    return boxes.map(box => {
        return <div className="bounding-box" 
                    style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}
                    key={uniqueKey++}>
                </div>
    });
}


export default FaceBoxes;