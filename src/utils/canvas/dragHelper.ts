import { Strings } from "../../config/strings";
import { Element, RectangleElement } from "../../config/types";

export const dragElement = (element: Element, diffX: number, diffY: number): Element => {
    switch (element.type) {
        case Strings.Tools.Rectangle:
            element = dragRectangle(element, diffX, diffY);
            break;
    
        default:
            break;
    }

    return element;
}

const dragRectangle = (rectangle: RectangleElement, diffX: number, diffY: number) => {
    let copyRectangle = {
        ...rectangle,
        startPoint: {
            x: rectangle.startPoint.x + diffX,
            y: rectangle.startPoint.y + diffY
        },
        endPoint: {
            x: rectangle.endPoint.x + diffX,
            y: rectangle.endPoint.y + diffY
        }
    } as RectangleElement
    
    return copyRectangle;
}