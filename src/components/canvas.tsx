import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import activeToolAtom from '../atoms/activeToolAtom';
import drawingsAtom from '../atoms/drawingsAtom';
import { MOUSEBUTTONS } from '../config/enums';
import { toScreenX, toScreenY, toTrueX, toTrueY } from '../utils/canvas/canvasHelper';
import { getFirstElementAtCursor } from '../utils/canvas/elementsHelper';
import { isObjectEmpty } from '../utils/util';
import { Element, PenElement, RectangleElement } from '../config/types';
import { Strings } from '../config/strings';

let local_drawings: Element[] = [];
let current_drawing_object: Element;

let cursorX: number;
let cursorY: number;
let prevCursorX: number;
let prevCursorY: number;

let offsetX = 0;
let offsetY = 0;

let scale = 1;

let leftMouseDown = false;
let middleMouseDown = false;
let isHoldingSpace = false;

let isFreeDrawing = false;

const Canvas = ({

}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const activeTool = useRecoilValue(activeToolAtom)
    const [drawings, setDrawings] = useRecoilState(drawingsAtom)

    const redrawCanvas = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        // set the canvas to the size of the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.fillStyle = '#fff';

        for (let i = 0; i < local_drawings.length; i++) {
            let element = local_drawings[i];
            if (element.type == Strings.Tools.Pen) {
                element = element as PenElement;
                for (let j = 0; j < element.points?.length - 1; j++) {
                    const currentPoint = element.points[j];
                    const nextPoint = element.points[j + 1];
                    drawLine(toScreenX(currentPoint.x, offsetX, scale), toScreenY(currentPoint.y, offsetY, scale),
                        toScreenX(nextPoint.x, offsetX, scale), toScreenY(nextPoint.y, offsetY, scale));
                }
            }
            if (element.type == Strings.Tools.Rectangle) {
                element = element as RectangleElement;
                drawRectangle(toScreenX(element.startPoint.x, offsetX, scale), toScreenY(element.startPoint.y, offsetY, scale),
                    toScreenX(element.endPoint.x, offsetX, scale), toScreenY(element.endPoint.y, offsetY, scale));
            }
        }
    }

    const drawLine = (
        x0: number,
        y0: number,
        x1: number,
        y1: number
    ) => {
        const canvas = canvasRef.current as HTMLCanvasElement
        const context = canvas.getContext('2d') as CanvasRenderingContext2D

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineCap = 'round';
        context.lineTo(x1, y1);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
    }

    const drawRectangle = (
        x0: number,
        y0: number,
        x1: number,
        y1: number
    ) => {
        const canvas = canvasRef.current as HTMLCanvasElement
        const context = canvas.getContext('2d') as CanvasRenderingContext2D

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

    const handleMouseMove = (event: React.MouseEvent) => {
        event.preventDefault();
        cursorX = event.pageX
        cursorY = event.pageY
        const canvas = canvasRef.current as HTMLCanvasElement
        //const context = canvas.getContext('2d') as CanvasRenderingContext2D

        const trueX = toTrueX(cursorX, offsetX, scale)
        const trueY = toTrueY(cursorY, offsetY, scale)
        const prevTrueX = toTrueX(prevCursorX, offsetX, scale)
        const prevTrueY = toTrueY(prevCursorY, offsetY, scale)
        if (leftMouseDown) {
            if (isFreeDrawing) {
                current_drawing_object = current_drawing_object as PenElement
                current_drawing_object?.points?.push({
                    x: trueX,
                    y: trueY
                })
                // draw a line
                drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
            }

            if (activeTool.name == Strings.Tools.Rectangle) {
                debugger;
                current_drawing_object = current_drawing_object as RectangleElement
                current_drawing_object.endPoint = {
                    x: trueX,
                    y: trueY
                }
                // redraw canvas to get rid of last rectangle
                redrawCanvas();
                // render new rectangle
                const screenStartX = toScreenX(current_drawing_object?.startPoint?.x, offsetX, scale);
                const screenStartY = toScreenY(current_drawing_object?.startPoint?.y, offsetY, scale);
                drawRectangle(screenStartX, screenStartY,
                    cursorX, cursorY);
            }
        }

        if (middleMouseDown) {
            // pan the canvas
            offsetX += (cursorX - prevCursorX);
            offsetY += (cursorY - prevCursorY);
            //console.log(offsetX, offsetY)
            redrawCanvas();
        }

        const elementAtCursor = getFirstElementAtCursor(trueX, trueY, local_drawings)
        if (elementAtCursor) {
            canvas.style.cursor = "move"
        }
        else {
            canvas.style.cursor = "default"
        }

        prevCursorX = cursorX;
        prevCursorY = cursorY;
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        //const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        // left mouse button
        if (event.button == MOUSEBUTTONS.LMB) {
            leftMouseDown = true;
            middleMouseDown = false;
            if (activeTool.name == Strings.Tools.Pen) {
                current_drawing_object = current_drawing_object as PenElement
                isFreeDrawing = true;
                canvas.style.cursor = 'crosshair';
                // TODO: see if there is a better way to generate this object
                current_drawing_object = {
                    type: Strings.Tools.Pen,
                    points: []
                }
            }

            else if (activeTool.name == Strings.Tools.Rectangle) {
                current_drawing_object = current_drawing_object as RectangleElement

                cursorX = event.pageX
                cursorY = event.pageY

                const trueX = toTrueX(cursorX, offsetX, scale)
                const trueY = toTrueY(cursorY, offsetY, scale)
                // TODO: see if there is a better way to generate this object
                current_drawing_object = {
                    type: Strings.Tools.Rectangle,
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
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.style.cursor = ''

        leftMouseDown = false
        middleMouseDown = false
        isFreeDrawing = false
        if (!isObjectEmpty(current_drawing_object)) {
            local_drawings.push(current_drawing_object);
            setDrawings([...local_drawings])
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        debugger;
        if(event.repeat) return;
        if(event.code == "Space"){
            console.log("space key pressed")
        }
    }

    const handleWheel = (event: React.WheelEvent) => {
        // TODO: make zooming "smooth"
        // TODO: make zooming focus on where the mouse is
        if (!middleMouseDown) {
            scale += -event.deltaY * 0.0005
            redrawCanvas();
        }
    }

    useEffect(() => {
        local_drawings = [...drawings]
        redrawCanvas()
    }, [])

    const renderCanvas = () => {
        console.log('rendering canvas')
        const canvasDOMWidth = window.innerWidth;
        const canvasDOMHeight = window.innerHeight;
        window.addEventListener('keydown', handleKeyDown, {passive: true});
        return (
            <canvas
                className='app-canvas'
                width={canvasDOMWidth}
                height={canvasDOMHeight}
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                //onKeyDown={handleKeyDown}
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