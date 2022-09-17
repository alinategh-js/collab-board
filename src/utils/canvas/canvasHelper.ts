/* 
Note:
    TrueX and TrueY are the real amounts of X and Y in the World regardless of the Screen.
    ScreenX and ScreenY are the converted amounts of TrueX and TrueY depending on the screen's offset and scale.
*/

export function toScreenX(xTrue: number, offsetX: number, scale: number) {
    return (xTrue + offsetX) * scale;
}
export function toScreenY(yTrue: number, offsetY: number, scale: number) {
    return (yTrue + offsetY) * scale;
}

export function toTrueX(xScreen: number, offsetX: number, scale: number) {
    return (xScreen / scale) - offsetX;
}
export function toTrueY(yScreen: number, offsetY: number, scale: number) {
    return (yScreen / scale) - offsetY;
}

export function trueHeight(canvas: HTMLCanvasElement, scale: number) {
    return canvas.clientHeight / scale;
}
export function trueWidth(canvas: HTMLCanvasElement, scale: number) {
    return canvas.clientWidth / scale;
}