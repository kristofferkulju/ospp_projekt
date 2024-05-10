
function Midfield({ height }) {
    return (
        <div
            style={{
                width: '4px',
                height: `${height}px`,
                backgroundColor: 'white',
                opacity: '100%',
                position: 'absolute',
                left: '50%',
                // transform: 'translateX(-50%)'
                overflow: 'hidden',
            }}
        />
    );
}

function Score({ scorePlayer, scoreOpponent }) {
    return (
        <div style={{ position: 'absolute', width: '100%', top: '20px', pointerEvents: 'none', fontFamily: "'Exo', sans-serif" }}>
            <div style={{ position: 'absolute', left: '440px', fontSize: '34px', color: 'white', textShadow: '1px 1px 1px #000000', fontWeight: '700' }}>
                {scorePlayer}
            </div>
            <div style={{ position: 'absolute', right: '435px', fontSize: '34px', color: 'white', textShadow: '1px 1px 1px #000000', fontWeight: '700' }}>
                {scoreOpponent}
            </div>
        </div>
    );
}

function Field({ scorePlayer, scoreOpponent, children, width, height }) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'rgb(223	132	118)',
                position: 'relative',
                display: 'flex',
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: '5px',
            }}
        >
            {/*<Score scorePlayer={scorePlayer} scoreOpponent={scoreOpponent} />*/}
            <Midfield height={height} />
            {children}
        </div>
    );
}

export default Field;