import {Schema, model} from "mongoose";

export interface INotify {
    entityType: string;
    entity: object | undefined;
    action: string;
    seen: boolean;
    sourceUser: object;
    userNeedToSendNotify: object[];
}

const notifySchema = new Schema<INotify>({
    entityType: String, //Playlists Songs
    entity: { type: Schema.Types.ObjectId, refPath: 'entityType' },
    action: String,
    seen: { type: Boolean, default: false },
    sourceUser: {type: Schema.Types.ObjectId, ref: 'Users'},
    userNeedToSendNotify: [{type: Schema.Types.ObjectId, ref: 'Users'}],
});

export const Notifies = model<INotify>('Notifies', notifySchema, 'notifies');