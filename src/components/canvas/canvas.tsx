import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import activeToolAtom from '../../atoms/activeToolAtom';
import drawingsAtom from '../../atoms/drawingsAtom';
import { MOUSEBUTTONS } from '../../config/enums';
import { toScreenX, toScreenY, toTrueX, toTrueY, trueHeight, trueWidth } from '../../utils/canvas/canvasHelper';
import { getFirstElementAtCursor } from '../../utils/canvas/elementsHelper';
import { isObjectEmptyOrNull } from '../../utils/util';
import { Element, PenElement, RectangleElement } from '../../config/types';
import { Strings } from '../../config/strings';
import { dragElement } from '../../utils/canvas/dragHelper';
import { v4 as uuidv4, V4Options } from 'uuid';
import toolPropsAtom from '../../atoms/toolPropsAtom';
import { drawLine, drawRectangle } from '../../utils/canvas/drawHelper';

let local_drawings: Element[] = [];
let current_drawing_object: Element | null;

let cursorX: number;
let cursorY: number;
let prevCursorX: number;
let prevCursorY: number;

let offsetX = 0;
let offsetY = 0;

let scale = 1;
const MAX_SCALE = 5;
const MIN_SCALE = 0.1;

let leftMouseDown = false;
let middleMouseDown = false;
let isHoldingSpace = false;

let isFreeDrawing = false;

let elementAtCursor: Element | null;

const Canvas = ({

}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
    const activeTool = useRecoilValue(activeToolAtom)
    const toolProps = useRecoilValue(toolPropsAtom)
    const [drawings, setDrawings] = useRecoilState(drawingsAtom)

    const redrawCanvas = () => {
        if (!context)
            return;

        const canvas = canvasRef.current as HTMLCanvasElement;

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
                    drawLine(context, toScreenX(currentPoint.x, offsetX, scale), toScreenY(currentPoint.y, offsetY, scale),
                        toScreenX(nextPoint.x, offsetX, scale), toScreenY(nextPoint.y, offsetY, scale),
                        element.properties, scale);
                }
            }
            if (element.type == Strings.Tools.Rectangle) {
                element = element as RectangleElement;
                drawRectangle(context, toScreenX(element.startPoint.x, offsetX, scale), toScreenY(element.startPoint.y, offsetY, scale),
                    toScreenX(element.endPoint.x, offsetX, scale), toScreenY(element.endPoint.y, offsetY, scale),
                    element.properties, scale);
            }
        }
    }

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!context)
            return;

        event.preventDefault();
        cursorX = event.pageX
        cursorY = event.pageY
        const canvas = canvasRef.current as HTMLCanvasElement

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
                drawLine(context, prevCursorX, prevCursorY, cursorX, cursorY, toolProps, scale);
            }

            else if (activeTool.name == Strings.Tools.Rectangle) {
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
                drawRectangle(context, screenStartX, screenStartY,
                    cursorX, cursorY, toolProps, scale);
            }

            else if (activeTool.name == Strings.Tools.Select) {
                if (elementAtCursor) {
                    const diffX = trueX - prevTrueX;
                    const diffY = trueY - prevTrueY;
                    elementAtCursor = dragElement(elementAtCursor, diffX, diffY);
                    let targetElementIndex = local_drawings
                        .findIndex(x => x.id == elementAtCursor?.id)
                    if (targetElementIndex >= 0) {
                        local_drawings[targetElementIndex] = { ...elementAtCursor }
                        redrawCanvas();
                    }
                }
            }
        }

        else if (middleMouseDown) {
            // pan the canvas
            const newOffsetX = offsetX + (trueX - prevTrueX);
            const newOffsetY = offsetY + (trueY - prevTrueY);
            changeOffset(newOffsetX, newOffsetY);

            redrawCanvas();
        }

        else if (activeTool.name == Strings.Tools.Select) {
            const tempElement = getFirstElementAtCursor(trueX, trueY, local_drawings)
            if (tempElement) {
                elementAtCursor = tempElement;
                canvas.style.cursor = "move"
            }
            else {
                elementAtCursor = null;
                canvas.style.cursor = "default"
            }
        }

        prevCursorX = cursorX;
        prevCursorY = cursorY;
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        const canvas = canvasRef.current as HTMLCanvasElement;

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
                    id: uuidv4(),
                    type: Strings.Tools.Pen,
                    points: [],
                    properties: toolProps
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
                    id: uuidv4(),
                    type: Strings.Tools.Rectangle,
                    startPoint: { x: trueX, y: trueY },
                    endPoint: { x: trueX, y: trueY },
                    properties: toolProps
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

        canvas.style.cursor = ''

        leftMouseDown = false
        middleMouseDown = false
        isFreeDrawing = false
        if (!isObjectEmptyOrNull(current_drawing_object)) {
            local_drawings.push(current_drawing_object as Element);
            current_drawing_object = null;
            setDrawings([...local_drawings])
        }

        if (activeTool.name == Strings.Tools.Select) {
            setDrawings([...local_drawings])
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.repeat) return;
        if (event.code == "Space") {
            console.log("space key pressed")
        }
    }

    const handleWheel = (event: React.WheelEvent) => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        if (!middleMouseDown && context) {
            const deltaY = event.deltaY;
            const scaleAmount = -deltaY / 800;
            const newScale = scale * (1 + scaleAmount)
            if (newScale > MAX_SCALE || newScale < MIN_SCALE)
                return
            scale = newScale;

            // zoom the page based on where the cursor is
            var distX = event.pageX / canvas.clientWidth;
            var distY = event.pageY / canvas.clientHeight;

            // calculate how much we need to zoom
            const unitsZoomedX = trueWidth(canvas, scale) * scaleAmount;
            const unitsZoomedY = trueHeight(canvas, scale) * scaleAmount;

            const unitsAddLeft = unitsZoomedX * distX;
            const unitsAddTop = unitsZoomedY * distY;

            let newOffsetX = offsetX - unitsAddLeft;
            let newOffsetY = offsetY - unitsAddTop;
            
            changeOffset(newOffsetX, newOffsetY);
            redrawCanvas();
        }
    }

    const changeOffset = (newOffsetX: number, newOffsetY: number) => {
        // if (Math.abs(newOffsetX) <= MAX_OFFSET_X)
        offsetX = newOffsetX;
        // if (Math.abs(newOffsetY) <= MAX_OFFSET_Y)
        offsetY = newOffsetY;
    }

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        setContext(ctx);
        local_drawings = [...drawings]
    }, [])

    useEffect(() => {
        redrawCanvas();
    }, [context])

    const renderCanvas = () => {
        console.log('rendering canvas')
        const canvasDOMWidth = window.innerWidth;
        const canvasDOMHeight = window.innerHeight;
        window.addEventListener('keydown', handleKeyDown, { passive: true });
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