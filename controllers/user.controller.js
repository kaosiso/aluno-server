const User = require("../models/user.models");
const Purchase = require("../models/purchase.model");
const Stripe = require("stripe");
const Course = require("../models/course.models");

exports.getUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};

exports.getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "enrolledCourses",
        select: "courseTitle courseThumbnail category level language", // Add other fields if needed
      })
      .select("enrolledCourses"); // Only return enrolledCourses, not whole user

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};

exports.purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.user._id;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.status(404).json({ success: false, message: "No Data Found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    // res.status(200).json({
    //   success: true,
    //   message: "Purchase logic goes here",
    //   data: {
    //     courseTitle: course.courseTitle,
    //     amount: course.coursePrice,
    //     userId,
    //     origin,
    //   },
    // });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Purchase Error:", error.message);
    res.status(500).json({
      success: false,
      // message: "Failed to initiate course purchase",
      message: error.message,
    });
  }
};
