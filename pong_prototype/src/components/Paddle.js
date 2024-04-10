import React from "react";

const Paddle = ({ top, left}) => {
    return (
        <div
        style = {{
            width: '30px',
            height: '100px',
            backgroundColor: 'blue',
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
        }}
        />
    );
};

export default Paddle;