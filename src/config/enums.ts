import { Strings } from "../config/strings"

export const TOOLS = [
    {
        name: Strings.Tools.Select,
    },
    {
        name: Strings.Tools.Pen,
    },
    {
        name: Strings.Tools.Rectangle
    }
] as const;

export const MOUSEBUTTONS = {
    LMB: 0, // Left mouse button
    MMB: 1, // Middle mouse button
}