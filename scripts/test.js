import { customAlphabet, nanoid } from "nanoid";
import * as script from "./library";

console.log(script.doesUserExist("user1@example.com"));
console.log(script.doesUserExist(""));