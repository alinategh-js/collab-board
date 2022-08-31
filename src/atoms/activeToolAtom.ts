import { atom } from "recoil";
import { TOOLS } from "../config/enums";
import { Tool } from "../config/types";

const activeToolAtom = atom<Tool>({
    key: 'activeTool', 
    default: TOOLS[0], // default value (aka initial value)
});

export default activeToolAtom;