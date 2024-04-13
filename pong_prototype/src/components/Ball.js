function Ball({ top, left }) {
    return (
        <div
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'red',
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
            }}
        />
    );
};

export default Ball;