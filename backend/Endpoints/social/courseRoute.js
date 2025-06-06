import express from "express";
import Course from "../../Database_Schema/social/Course.js";

const courseRoute = express.Router();

// GET /api/courses — Get all courses, newest first
courseRoute.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses — Create a new course (for scraper or manual)
courseRoute.post("/", async (req, res) => {
  const {
    title,
    description,
    content,
    url,
    img,
  } = req.body;

  if (!title || !content || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      content,
      url,
      img,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    // If duplicate (based on unique index), you’ll get a Mongo error code
    if (err.code === 11000) {
      res.status(409).json({ error: "Course already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default courseRoute;
