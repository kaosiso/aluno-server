const express = require('express');
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require('./db/connectDB');
const { connectCloudinary } = require('./configs/cloudinary');

const authRoutes = require('./routes/auth.route');
// const courseRoutes = require('./routes/course.route');
// const instructorRoutes = require('./routes/instructor.route');
// const userRoutes = require('./routes/user.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
// app.use("/api/course", courseRoutes);
// app.use("/api/instructor", instructorRoutes);
// app.use("/api/user", userRoutes);


app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(" Failed to start server:", error);
  }
};

startServer();
