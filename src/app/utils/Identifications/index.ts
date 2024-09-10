// @ts-ignore
import { customAlphabet } from "nanoid";

const CUSTOM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-'
const ID_SIZE = 12

export const generatedID = (apb = CUSTOM_ALPHABET, size = ID_SIZE) => customAlphabet(apb)(size)