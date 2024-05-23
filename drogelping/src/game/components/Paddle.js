function Paddle({ isLeftPaddle, width, height, top, isPlayer }) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: isPlayer ? 'white' : '#bbbbbb',
                position: 'absolute',
                [isLeftPaddle ? 'left' : 'right']: isLeftPaddle ? '2%' : '2%',
                top: `${top}px`,
            }}
        />
    );
}

export default Paddle;