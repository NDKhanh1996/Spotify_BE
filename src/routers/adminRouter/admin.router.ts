import express from "express";
import {Security} from "../../security/security";
import AdminController from "../../controllers/admincontroller/userManager.controller";
const adminApiRouter = express.Router()

adminApiRouter.use(Security.verifyToken, Security.checkAdmin);

adminApiRouter.get('/user-list', AdminController.getUserList);
adminApiRouter.get('/singers', AdminController.getSingers);
adminApiRouter.get('/composers', AdminController.getComposers);
adminApiRouter.get('/tags', AdminController.getTags);

adminApiRouter.post('/singers', AdminController.addSinger);
adminApiRouter.delete('/singers/:id', AdminController.deleteSinger);
adminApiRouter.post('/composers', AdminController.addComposer);
adminApiRouter.delete('/composers/:id', AdminController.deleteComposer);
adminApiRouter.post('/tags', AdminController.addTag);
adminApiRouter.delete('/tags/:id', AdminController.deleteTag);

export default adminApiRouter
