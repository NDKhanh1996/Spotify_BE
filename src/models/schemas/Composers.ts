import {Schema, model} from "mongoose";

interface IComposers {
    name: string
}

const composerSchema = new Schema<IComposers>({
    name: String
});
export const Composers = model<IComposers>('Composers', composerSchema, 'composers');