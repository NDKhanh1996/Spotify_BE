import {Schema, model} from "mongoose";

interface IRefreshTokens {
    refreshToken: string,
    user: object
}

const refreshTokenSchema = new Schema<IRefreshTokens>({
    refreshToken: String,
    user: {type: Schema.Types.ObjectId, ref: 'Users'}
});

export const RefreshTokens = model<IRefreshTokens>('RefreshTokens', refreshTokenSchema, 'refreshTokens');