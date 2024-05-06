
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

function Score({ scoreP1, scoreP2 }) {
    return (
        <div style={{ position: 'absolute', width: '100%', top: '20px', pointerEvents: 'none', fontFamily: "'Exo', sans-serif" }}>
            <div style={{ position: 'absolute', left: '440px', fontSize: '34px', color: 'white', textShadow: '1px 1px 1px #000000', fontWeight: '700' }}>
                {scoreP1}
            </div>
            <div style={{ position: 'absolute', right: '435px', fontSize: '34px', color: 'white', textShadow: '1px 1px 1px #000000', fontWeight: '700' }}>
                {scoreP2}
            </div>
        </div>
    );
}

function Field({ scoreP1, scoreP2, children, width, height }) {
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
            <Score scoreP1={scoreP1} scoreP2={scoreP2} />
            {children}
            <Midfield height={height} />
        </div>
    );
}

export default Field;