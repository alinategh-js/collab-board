import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import activeToolAtom from '../atoms/activeToolAtom';
import drawingsAtom from '../atoms/drawingsAtom';
import { toScreenX, toScreenY, toTrueX, toTrueY } from '../utils/canvasHelper';
import { MOUSEBUTTONS, TOOLS } from '../utils/enums';

let local_drawings = [];
let current_drawing_object = {};

let cursorX;
let cursorY;
let prevCursorX;
let prevCursorY;

let offsetX = 0;
let offsetY = 0;

let leftMouseDown = false;
let middleMouseDown = false;

let isFreeDrawing = false;

let dx = 0.5
let dy = 0.5

const Canvas = ({

}) => {
    const canvasRef = useRef(null)

    const activeTool = useRecoilValue(activeToolAtom)
    const [drawings, setDrawings] = useRecoilState(drawingsAtom)

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        // set the canvas to the size of the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.fillStyle = '#fff';

        for (let i = 0; i < local_drawings.length; i++) {
            const element = local_drawings[i];
            if (element.type == "Pen") {
                for (let j = 0; j < element.points?.length; j++) {
                    const line = element.points[j];
                    drawLine(toScreenX(line.x0, offsetX), toScreenY(line.y0, offsetY),
                        toScreenX(line.x1, offsetX), toScreenY(line.y1, offsetY));
                }
            }
            if (element.type == "Rectangle") {
                drawRectangle(toScreenX(element.startPoint.x, offsetX), toScreenY(element.startPoint.y, offsetY),
                    toScreenX(element.endPoint.x, offsetX), toScreenY(element.endPoint.y, offsetY));
            }
        }
    }

    const drawLine = (x0, y0, x1, y1) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineCap = 'round';
        context.lineTo(x1, y1);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
    }

    const drawRectangle = (x0, y0, x1, y1) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineCap = 'round';

        const width = x1 - x0;
        const height = y1 - y0;
        context.rect(x0, y0, width, height)
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
    }

    const handleMouseMove = (event) => {
        event.preventDefault();
        cursorX = event.pageX
        cursorY = event.pageY

        const trueX = toTrueX(cursorX, offsetX)
        const trueY = toTrueY(cursorY, offsetY)
        const prevTrueX = toTrueX(prevCursorX, offsetX)
        const prevTrueY = toTrueY(prevCursorY, offsetY)
        if (leftMouseDown) {
            if (isFreeDrawing) {
                current_drawing_object?.points?.push({
                    x0: prevTrueX,
                    y0: prevTrueY,
                    x1: trueX,
                    y1: trueY
                })
                // draw a line
                drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
            }

            if (activeTool == "Rectangle") {
                current_drawing_object.endPoint = {
                    x: trueX,
                    y: trueY
                }
                // redraw canvas to get rid of last rectangle
                redrawCanvas();
                // render new rectangle
                const screenStartX = toScreenX(current_drawing_object?.startPoint?.x, offsetX);
                const screenStartY = toScreenY(current_drawing_object?.startPoint?.y, offsetY);
                drawRectangle(screenStartX, screenStartY,
                    cursorX, cursorY);
            }
        }

        if (middleMouseDown) {
            // pan the canvas
            offsetX += (cursorX - prevCursorX);
            offsetY += (cursorY - prevCursorY);
            console.log(offsetX, offsetY)
            redrawCanvas();
        }

        prevCursorX = cursorX;
        prevCursorY = cursorY;
    }

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // left mouse button
        if (event.button == MOUSEBUTTONS.LMB) {
            leftMouseDown = true;
            middleMouseDown = false;
            if (activeTool == "Pen") {
                isFreeDrawing = true;
                canvas.style.cursor = 'crosshair';
                current_drawing_object = {
                    type: TOOLS[0].name,
                    points: []
                }
            }

            else if (activeTool == "Rectangle") {
                cursorX = event.pageX
                cursorY = event.pageY

                const trueX = toTrueX(cursorX, offsetX)
                const trueY = toTrueY(cursorY, offsetY)
                current_drawing_object = {
                    type: "Rectangle",
                    startPoint: { x: trueX, y: trueY },
                    endPoint: { x: trueX, y: trueY }
                }
            }
        }

        // middle mouse button ( wheel )
        if (event.button == MOUSEBUTTONS.MMB) {
            middleMouseDown = true;
            leftMouseDown = false;
            canvas.style.cursor = 'grabbing'
        }

        cursorX = event.pageX;
        cursorY = event.pageY;
        prevCursorX = event.pageX;
        prevCursorY = event.pageY;
    }

    const handleMouseUp = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.style.cursor = ''

        leftMouseDown = false
        middleMouseDown = false
        isFreeDrawing = false
        local_drawings.push(current_drawing_object);
        setDrawings([...local_drawings])
    }

    useEffect(() => {
        local_drawings = [...drawings]
        redrawCanvas()
    }, [])

    const renderCanvas = () => {
        console.log('rendering canvas')
        const canvasDOMWidth = window.innerWidth;
        const canvasDOMHeight = window.innerHeight;
        return (
            <canvas
                className='app-canvas'
                width={canvasDOMWidth}
                height={canvasDOMHeight}
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            />
        );
    }

    return (
        <div>
            {renderCanvas()}
        </div>
    )
}

export default Canvas;