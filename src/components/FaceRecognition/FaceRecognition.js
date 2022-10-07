import React from "react";
import FaceBoxes from "./FaceBoxes.js"


const FaceRecognition = ({ boxes, imageUrl }) => {
    return(
        <div className="center ma">
            <div className="absolute mt2">
                <img id="inputImage" src={imageUrl} alt="" width={'500px'} height={'auto'} />
                <FaceBoxes boxes={boxes} />
            </div>
        </div>
    );
}


export default FaceRecognition;