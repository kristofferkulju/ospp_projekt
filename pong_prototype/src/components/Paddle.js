function Paddle({width, left, top }) {
    return (
        <div
        style = {{
            width: `${width}px`,
            height: '100px',
            backgroundColor: 'white',
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
        }}
        />
    );
}

export default Paddle;