const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const courseController = require("../controllers/course.controller");

const router = express.Router();

// Public: anyone can get courses
router.get("/all", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);



module.exports = router;
