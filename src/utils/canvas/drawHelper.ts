// this file contains some helper methods for drawing different shapes on the canvas

import { ToolProps } from "../../config/types";

export const drawLine = (
    context: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    properties: ToolProps,
    scale: number
) => {
    if (!context)
        return;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineCap = properties.lineCap;
    context.lineTo(x1, y1);
    context.strokeStyle = properties.strokeStyle;
    context.lineWidth = properties.lineWidth * scale;
    context.stroke();
}

export const drawRectangle = (
    context: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    properties: ToolProps,
    scale: number
) => {
    if (!context)
        return;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineCap = properties.lineCap;

    const width = x1 - x0;
    const height = y1 - y0;
    context.rect(x0, y0, width, height)
    context.strokeStyle = properties.strokeStyle;
    context.lineWidth = properties.lineWidth * scale;
    context.stroke();
}