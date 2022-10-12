import { atom } from "recoil";
import { ToolProps } from "../config/types";

const defaultToolProps : ToolProps = {
    lineCap: "round",
    lineWidth: 2,
    strokeStyle: "#000"
}

const toolPropsAtom = atom<ToolProps>({
    key: 'toolProps', 
    default: defaultToolProps, // default value (aka initial value)
});

export default toolPropsAtom;