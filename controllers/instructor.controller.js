const Course = require("../models/course.models");
const User = require("../models/user.models");
const upload = require("../configs/multer");
const { cloudinary } = require("../configs/cloudinary");
const { Purchase } = require("../models/purchase.model");

//  Make user an instructor
exports.becomeInstructor = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "instructor") {
      return res.status(400).json({
        success: false,
        message: "You're already an instructor",
      });
    }

    user.role = "instructor";
    await user.save();

    res.json({
      success: true,
      message: "You are now an instructor and can publish courses",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Create new course
exports.createCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const instructorId = req.user._id;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail not attached",
      });
    }

    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
      console.log("📦 Parsed courseData:", parsedCourseData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseData JSON",
      });
    }

    // 🔐 Securely attach instructor ID
    parsedCourseData.courseAuthor = instructorId;

    // ☁️ Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    // 📚 Create course in DB
    const newCourse = await Course.create(parsedCourseData);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("❌ Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

//  Get all courses by the instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ courseAuthor: instructorId });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get Instructor Dashboard Data
exports.getInstructorDashboardData = async (req, res) => {
  try {
    const instructorId = req.user._id;
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getEnrolledStudentsData = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ courseAuthor: instructorId });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
