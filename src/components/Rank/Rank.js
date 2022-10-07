import React from "react";


const Rank = ({ userName, userEntries }) => {
    return(
        <div className="ma4 mt0">
            <div className="white f3">
                {`${userName}, your current entry count is`}
            </div>

            <div className="white f1">
                {userEntries}
            </div>
        </div>
    );
}


export default Rank;