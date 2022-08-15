import { TOOLS } from './enums';
import { Strings } from './strings';

type _ExcludedTools = typeof Strings.Tools.Select;

type _ElementType = Exclude<typeof TOOLS[number]["name"], _ExcludedTools>;

type _CBBaseElement = Readonly<{
    type: _ElementType,
}>;

export type CBRectangleElement = _CBBaseElement & {
    type: typeof Strings.Tools.Rectangle
};

export type CBPenElement = _CBBaseElement & {
    type: typeof Strings.Tools.Pen
};