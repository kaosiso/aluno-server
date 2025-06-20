const express = require("express");
const {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");

const userRouter = express.Router();

// Apply verifyToken middleware to protect routes
userRouter.get("/data", verifyToken, getUserData);
userRouter.get("/enrolled-courses", verifyToken, getUserEnrolledCourses);
userRouter.post("/purchase-course", verifyToken, purchaseCourse);

module.exports = userRouter;
