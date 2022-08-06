const errorMargin = 10; // the margin of error of the cursor position for determining a hit

export const getFirstElementAtCursor = (x, y, elements) => {
    let isHittingElement = false;
    let foundElement;
    for (let element of elements) {
        const elementName = element.type;
        switch (elementName) {
            case "Rectangle":
                isHittingElement = isCursorHittingRectangleElement(x, y, element)
                break;
            case "Pen":
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

const isCursorHittingPenElement = (x, y, element) => {
    return false;
}

const isCursorHittingRectangleElement = (x, y, element) => {
    const startPoint = element.startPoint;
    const endPoint = element.endPoint;
    return (isCursorOnHorizontalLine(x, y, startPoint.x, endPoint.x, startPoint.y)
        || isCursorOnHorizontalLine(x, y, startPoint.x, endPoint.x, endPoint.y)
        || isCursorOnVerticalLine(x, y, endPoint.y, startPoint.y, startPoint.x)
        || isCursorOnVerticalLine(x, y, endPoint.y, startPoint.y, endPoint.x))
}

function checkInRange(x, y, xMin, xMax, yMin, yMax) {
    return (x <= xMax && x >= xMin && y <= yMax && y >= yMin);
}

function isCursorOnHorizontalLine(x, y, lineX0, lineX1, lineY, error = errorMargin) {
    const yMax = lineY + error;
    const yMin = lineY - error;
    const xMin = Math.min(lineX0, lineX1);
    const xMax = Math.max(lineX0, lineX1);

    return checkInRange(x, y, xMin, xMax, yMin, yMax);
}

function isCursorOnVerticalLine(x, y, lineY0, lineY1, lineX, error = errorMargin) {
    const yMax = Math.max(lineY0, lineY1);
    const yMin = Math.min(lineY0, lineY1);
    const xMin = lineX - error;
    const xMax = lineX + error;

    return checkInRange(x, y, xMin, xMax, yMin, yMax);
}