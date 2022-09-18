import React, { useEffect, useRef } from "react";

const MapCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const redrawCanvas = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        // canvas.width = window.innerWidth / 10;
        // canvas.height = window.innerHeight / 10;
    }

    useEffect(() => {
        redrawCanvas();
    }, [])

    const renderCanvas = () => {
        const canvasDOMWidth = window.innerWidth / 8;
        const canvasDOMHeight = window.innerHeight / 8;
        //window.addEventListener('keydown', handleKeyDown, { passive: true });
        return (
            <canvas
                className='map-canvas'
                width={canvasDOMWidth}
                height={canvasDOMHeight}
                ref={canvasRef}
                // onMouseMove={handleMouseMove}
                // onMouseDown={handleMouseDown}
                // onMouseUp={handleMouseUp}
                // onWheel={handleWheel}
            />
        );
    }

    return (
        <div>
            {renderCanvas()}
        </div>
    )
}

export default MapCanvas;