function Ball ({ left, top }) {
    return (
        <div
            style={{
                width: '20px',
                height: '20px',
                // borderRadius: '50%',
                backgroundColor: 'white',
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
            }}
        />
    );
}

export default Ball;