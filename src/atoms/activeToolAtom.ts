import { atom } from "recoil";
import { TOOLS } from "../config/enums";

const activeToolAtom = atom({
    key: 'activeTool', 
    default: TOOLS[0].name, // default value (aka initial value)
});

export default activeToolAtom;