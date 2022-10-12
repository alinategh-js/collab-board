import { TOOLS } from './enums';
import { Strings } from './strings';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX | string;

export interface IIndexable<T = any> {
    [key: string]: T
}

export type Tool = {
    name: string,
    icon: string,
}

type _ExcludedTools = typeof Strings.Tools.Select;

type _ElementType = Exclude<typeof TOOLS[number]["name"], _ExcludedTools>;

type _BaseElement = Readonly<{
    id: string,
    type: _ElementType,
    properties: ToolProps
}>;

export type Point = {
    x: number,
    y: number
}

export type Line = {
    x0: number,
    y0: number,
    x1: number,
    y1: number,
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

// ======================================================================================

export type ToolProps = {
    lineCap: 'butt' | 'round' | 'square',
    lineWidth: number,
    strokeStyle: Color
}