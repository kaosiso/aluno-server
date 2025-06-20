const Course = require("../models/course.models");
const User = require("../models/user.models");
//get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "courseAuthor", // or "instructor" if your schema uses that name
      select: "-password -__v", // show all instructor info except sensitive ones
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// get course by Id
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    let courseData = await Course.findById(id).populate({
      path: "courseAuthor", // adjust if your field is named differently
      // select: "name imageUrl bio"
    });

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Convert Mongoose document to plain JS object so we can modify it
    courseData = courseData.toObject();

    // Loop through chapters and lectures to remove lectureUrl where isPreviewFree is false
    courseData.courseContent = courseData.courseContent.map((chapter) => {
      const filteredLectures = chapter.chapterContent.map((lecture) => {
        if (!lecture.isPreviewFree) {
          const { lectureUrl, ...rest } = lecture;
          return rest;
        }
        return lecture;
      });

      return {
        ...chapter,
        chapterContent: filteredLectures,
      };
    });

    res.status(200).json({
      success: true,
      data: courseData,
    });
  } catch (error) {
    console.error("Error fetching course:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch course" });
  }
};

