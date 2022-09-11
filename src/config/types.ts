import { TOOLS } from './enums';
import { Strings } from './strings';

export type Tool = {
    name: string
}

type _ExcludedTools = typeof Strings.Tools.Select;

type _ElementType = Exclude<typeof TOOLS[number]["name"], _ExcludedTools>;

type _BaseElement = Readonly<{
    type: _ElementType,
}>;

export type Point = {
    x: number,
    y: number
}

export type Line = {
    x0: number,
    y0: number,
    x1: number,
    y1: number
}

export type RectangleElement = _BaseElement & {
    type: typeof Strings.Tools.Rectangle,
    startPoint: Point,
    endPoint: Point
};

export type PenElement = _BaseElement & {
    type: typeof Strings.Tools.Pen,
    points: Point[]
};

export type Element = 
RectangleElement | 
PenElement;