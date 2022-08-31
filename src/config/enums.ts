import { Strings } from "../config/strings"
import { Tool } from "./types";

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
] as Tool[];

export const getToolByName = (name: string): Tool => {
    const tool = TOOLS.find(x => x.name == name)
    if (tool != undefined) return tool
    else return TOOLS[0]
}

export const MOUSEBUTTONS = {
    LMB: 0, // Left mouse button
    MMB: 1, // Middle mouse button
}