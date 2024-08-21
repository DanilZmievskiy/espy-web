import express from "express";
import Controller from "../controllers/espy.controller.js";

const router = express.Router();

router.post("/signup", Controller.createUser);
router.post("/login", Controller.loginUser);
router.get("/getPaths", Controller.getPaths);
router.post("/createOrder", Controller.createOrder)
router.get("/userOrders", Controller.getUserOrders)
router.get("/getAllOrders", Controller.getAllOrders)
router.get("/getAllDrivers", Controller.getAllDrivers)
router.post("/approveOrder", Controller.approveOrder)
router.get("/getDriverOrders", Controller.getDriverOrders)
router.post("/updateOrderStatus", Controller.updateOrderStatus)
router.get("/getUser", Controller.getUser)

export default router;