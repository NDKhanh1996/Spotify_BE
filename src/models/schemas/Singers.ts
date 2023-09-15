import {Schema, model} from "mongoose";

interface ISingers {
    name: string
}

const singerSchema = new Schema<ISingers>({
    name: String
});
export const Singers = model<ISingers>('Singers', singerSchema, 'singers');