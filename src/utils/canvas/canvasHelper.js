export function toScreenX(xTrue, offsetX, scale) {
    return (xTrue + offsetX) * scale;
}
export function toScreenY(yTrue, offsetY, scale) {
    return (yTrue + offsetY) * scale;
}
export function toTrueX(xScreen, offsetX, scale) {
    return (xScreen / scale) - offsetX;
}
export function toTrueY(yScreen, offsetY, scale) {
    return (yScreen / scale) - offsetY;
}