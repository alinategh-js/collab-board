import { Strings } from "../../config/strings";
import { Element, RectangleElement } from "../../config/types";

const ERROR_MARGIN = 10; // the margin of error of the cursor position for determining a hit

export const getFirstElementAtCursor = (x: number, y: number, elements: Element[]) => {
    let isHittingElement = false;
    let foundElement;
    for (let element of elements) {
        const elementName = element.type;
        switch (elementName) {
            case Strings.Tools.Rectangle:
                isHittingElement = isCursorHittingRectangleElement(x, y, element)
                break;
            case Strings.Tools.Pen:
                isHittingElement = isCursorHittingPenElement(x, y, element)
                break;

            default:
                break;
        }

        if (isHittingElement) {
            foundElement = element;
            break;
        }
    }

    return foundElement;
}

const isCursorHittingPenElement = (x: number, y: number, element: Element) => {
    return false;
}

const isCursorHittingRectangleElement = (x: number, y: number, element: RectangleElement) => {
    const startPoint = element.startPoint;
    const endPoint = element.endPoint;
    return (isCursorOnHorizontalLine(x, y, startPoint.x, endPoint.x, startPoint.y)
        || isCursorOnHorizontalLine(x, y, startPoint.x, endPoint.x, endPoint.y)
        || isCursorOnVerticalLine(x, y, endPoint.y, startPoint.y, startPoint.x)
        || isCursorOnVerticalLine(x, y, endPoint.y, startPoint.y, endPoint.x))
}

function checkInRange(x: number, y: number, xMin: number, xMax: number, yMin: number, yMax: number) {
    return (x <= xMax && x >= xMin && y <= yMax && y >= yMin);
}

function isCursorOnHorizontalLine(x: number, y: number, lineX0: number, lineX1: number, lineY: number, error = ERROR_MARGIN) {
    const yMax = lineY + error;
    const yMin = lineY - error;
    const xMin = Math.min(lineX0, lineX1);
    const xMax = Math.max(lineX0, lineX1);

    return checkInRange(x, y, xMin, xMax, yMin, yMax);
}

function isCursorOnVerticalLine(x: number, y: number, lineY0: number, lineY1: number, lineX: number, error = ERROR_MARGIN) {
    const yMax = Math.max(lineY0, lineY1);
    const yMin = Math.min(lineY0, lineY1);
    const xMin = lineX - error;
    const xMax = lineX + error;

    return checkInRange(x, y, xMin, xMax, yMin, yMax);
}