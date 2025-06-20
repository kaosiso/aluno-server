const express = require("express"); const router = express.Router(); const verifyToken = require("../middleware/verifyToken"); const verifyRole = require("../middleware/verifyRole"); const { becomeInstructor, createCourse, getInstructorCourses, getInstructorDashboardData, getEnrolledStudentsData } = require("../controllers/instructor.controller"); const upload = require("../configs/multer");

router.post("/become-instructor", verifyToken, becomeInstructor); 
router.post("/create-course", verifyToken, verifyRole("instructor"), upload.single("image"), createCourse); 
router.get("/courses", verifyToken, verifyRole("instructor"), getInstructorCourses); 
router.get("/dashboard", verifyToken, verifyRole("instructor"), getInstructorDashboardData); 
router.get("/enrolled-students", verifyToken, verifyRole("instructor"), getEnrolledStudentsData);

module.exports = router;
