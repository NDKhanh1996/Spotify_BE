import { Singers } from "../../models/schemas/Singers";
import { Users } from "../../models/schemas/Users";
import { Composers } from "../../models/schemas/Composers";
import { Tags } from "../../models/schemas/Tags";
class AdminController {

    static async getUserList(req, res) {
        try {
            let userList = await Users.find()
            if (userList.length === 0) {
                const data = {
                    status: 'empty',
                    message: 'there is no user in the List'
                }
                return res.status(200).json(data)
            } else {
                res.status(200).json({
                    status: 'full',
                    list: userList
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed"
            })
        }
    }
    static async getSingers(req, res) {
        try {
            let singers = await Singers.find()
            if (singers.length === 0) {
                const data = {
                    status: 'empty',
                    message: 'there is no Singer in the List'
                }
                return res.status(200).json(data)
            } else {
                res.status(200).json({
                    status: 'full',
                    singers: singers
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed"
            })
        }
    }
    
    static async getComposers(req, res) {
        try {
            let composers = await Composers.find()
            if (composers.length === 0) {
                const data = {
                    status: 'empty',
                    message: 'there is no composer in the List'
                }
                return res.status(200).json(data)
            } else {
                res.status(200).json({
                    status: 'full',
                    composers: composers
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed"
            })
        }
    }

    static async getTags(req, res) {
        try {
            let tags = await Tags.find()
            if (tags.length === 0) {
                const data = {
                    status: 'empty',
                    message: 'there is no composer in the List'
                }
                return res.status(200).json(data)
            } else {
                res.status(200).json({
                    status: 'full',
                    tags: tags
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed"
            })
        }
    }
    static async addSinger(req,res){
        try{
            let singers = await Singers.find({name:req.body.name})
        if(singers.length===0){
            let newSinger = new Singers({
                name:req.body.name
            })
            await newSinger.save()
           return res.status(200).json({
                status:"success",
                message:"add singer success"
            })
        }
         res.status(409).json({
            status:"Failed",
            message:"Singer name has existed"
        })
        }catch(err){
            res.status(500).json({
                message:"Failed"
            })
        }
    }
    static async deleteSinger(req, res) {
        try {
            await Singers.deleteOne({ _id: req.params.id});
            res.status(200).json({ message: "delete Singer success" })
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }

    static async addComposer(req,res){
        let composers =  await Composers.find({name:req.body.name})
        if(composers.length === 0){
            let newComposer = new Composers({
                name:req.body.name
            })
            await newComposer.save()
            return res.status(200).json({
                status:"success",
                message:"add Composer success"
            })
        }
        res.status(409).json({
            status:"Failed",
            message:"Composer name has existed"
        })
    }
    static async deleteComposer(req, res) {
        try {
            await Composers.deleteOne({ _id: req.params.id});
            res.status(200).json({ message: "delete Composer success" })
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }
    static async addTag(req,res){
        let tags =  await Tags.find({name:req.body.name})
        if(tags.length === 0){
            let newTag = new Tags({
                name:req.body.name
            })
            await newTag.save()
            return res.status(200).json({
                status:"success",
                message:"add tag success"
            })
        }
        res.status(409).json({
            status:"Failed",
            message:"tag name has existed"
        })
    }
    static async deleteTag(req, res) {
        try {
            await Tags.deleteOne({ _id: req.params.id});
            res.status(200).json({ message: "delete tag success" })
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }
}


export default AdminController