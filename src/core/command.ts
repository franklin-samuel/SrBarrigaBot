import {Context} from "./context.js";


export abstract class Command<R> {
    abstract execute(context: Context): R;
}