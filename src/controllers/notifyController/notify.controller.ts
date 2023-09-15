import {Notifies} from "../../models/schemas/Notify";
import {Users} from "../../models/schemas/Users";
import {Comments} from "../../models/schemas/Comments";

export class NotifyController {
    static async createNotify(entityType: string, playlist: object, song: object, action: string, req: any) {
        try {
            const userId = req.user.id
            const user = await Users.findById(userId);

            const uploader = await NotifyController.createUploaderNeedToSend(entityType, playlist, song, action, req);
            const uploaderId = uploader["_id"]
            const commentingUsers: any = await NotifyController.createCommentingUserNeedToSend(entityType, playlist, song, action, req);
            commentingUsers.push(uploaderId);
            const userNeedToSendNotifyId = [...new Set(commentingUsers.map(userId => userId.toString()))];

            const notify = await Notifies.create({
                entityType: entityType,
                entity: song || playlist,
                action: action,
                sourceUser: user,
                userNeedToSendNotify: userNeedToSendNotifyId,
            });

            const userNeedToSendNotifyObject = await Promise.all(userNeedToSendNotifyId.map(userId => Users.findById(userId)));
            for (const user of userNeedToSendNotifyObject) {
                user["notify"].push(notify);
                // @ts-ignore
                await user.save();
            }

            return {message: "Create notify complete", detail: notify};
        } catch (e) {
            return {location: "createNotify", message: "Create notify error", detail: e};
        }
    }

    static async createUploaderNeedToSend(entityType: string, playlist: object, song: object, action: string, req: any) {
        try {
            const entity = entityType === "Songs" ? song : playlist;
            return await Users.findById(entity["uploader"]);
        } catch (e) {
            return {location: "createUploaderNeedToSend", message: "Create notify error", detail: e};
        }
    }

    static async createCommentingUserNeedToSend(entityType: string, playlist: object, song: object, action: string, req: any) {
        try {
            const entity = entityType === "Songs" ? song : playlist;
            const property = entityType === "Songs" ? "song" : "playlist"
            const allComment = await Comments.find({[property]: entity["_id"]});
            return allComment.map(comment => comment.user);

        } catch (e) {
            return {location: "createCommentingUserNeedToSend", message: "Create notify error", detail: e};
        }
    }

    static async changeToSeen(req: any, res: any) {
        try {
            const notifyId = req.params["id"];
            const notify = await Notifies.findById(notifyId);
            if (notify.seen == false) {
                notify.seen = true;
                await notify.save();
                res.status(200).json({message: "change to seen successful"});
            } else {
                res.status(200).json({message: "this notify already seen"});
            }

        } catch (e) {
            res.status(500).json({location: "changeToSeen", message: "change notify to seen error", detail: e});
        }
    }

    static async deleteNotify() {

    }
}