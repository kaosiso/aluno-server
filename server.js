const express = require('express');
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require('./db/connectDB');
const { connectCloudinary } = require('./configs/cloudinary');

const authRoutes = require('./routes/auth.route');
const courseRoutes = require('./routes/course.route');
const instructorRoutes = require('./routes/instructor.route');
const userRoutes = require('./routes/user.route');

const app = express();
const PORT = process.env.PORT || 5000;
const __dirnameLocal = path.resolve(); // Avoid duplicate declaration error

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
app.use("/api/course", courseRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/user", userRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirnameLocal, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirnameLocal, "client", "dist", "index.html"));
  });
}

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
