import {Schema, model} from "mongoose";

interface ITags {
    name: string
}

const tagSchema = new Schema<ITags>({
    name: String
});
export const Tags = model<ITags>('Tags', tagSchema, 'tags');