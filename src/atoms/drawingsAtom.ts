import { atom } from "recoil";
import { Element } from "../config/types";
import { localStorageEffect, localStorageKeys } from "../utils/localStorage";

const drawingsAtom = atom<Element[]>({
    key: 'drawings',
    default: [],
    effects: [
        localStorageEffect(localStorageKeys.Drawings),
    ]
});

export default drawingsAtom;