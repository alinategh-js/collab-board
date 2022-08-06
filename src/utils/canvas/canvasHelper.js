export function toScreenX(xTrue, offsetX) {
    return (xTrue + offsetX);
}
export function toScreenY(yTrue, offsetY) {
    return (yTrue + offsetY);
}
export function toTrueX(xScreen, offsetX) {
    return (xScreen) - offsetX;
}
export function toTrueY(yScreen, offsetY) {
    return (yScreen) - offsetY;
}