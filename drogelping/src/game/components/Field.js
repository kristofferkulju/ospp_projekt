function Midfield({ height }) {
    return (
        <div
            style={{
                width: '2px',
                height: `${height}px`,
                backgroundColor: 'white',
                opacity: '50%',
                position: 'absolute',
                left: '50%',
                // transform: 'translateX(-50%)'
                overflow: 'hidden',
            }}
        />
    );
}

function Field({ children, left, top, width, height }) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'black',
                position: 'relative',
                display: 'flex',
            }}
        >
            {children}
            <Midfield height={height} />
        </div>
    );
}

export default Field;