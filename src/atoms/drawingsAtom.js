import { atom } from "recoil";
import { localStorageEffect, localStorageKeys } from "../utils/localStorage";

const drawingsAtom = atom({
    key: 'drawings',
    default: [],
    effects: [
        localStorageEffect(localStorageKeys.Drawings),
    ]
});

export default drawingsAtom;