function Ball ({ ballSize, left, top }) {
    return (
        <div
            style={{
                width: `${ballSize}px`,
                height: `${ballSize}px`,
                borderRadius: '50%',
                backgroundColor: 'rgb(255,224,103)',
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
            }}
        />
    );
}

export default Ball;