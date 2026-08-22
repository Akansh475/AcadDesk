import { Router } from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCalendar,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAttendanceByCourseAndDate,
  saveBulkAttendance,
  getNotifications,
  createNotification,
} from "./admin.controller.js";

const router = Router();

// STUDENTS
router.get("/students", getStudents);
router.post("/students", createStudent);
router.patch("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// COURSES
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.patch("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// CALENDAR
router.get("/calendar", getCalendar);
router.post("/calendar", createCalendarEvent);
router.patch("/calendar/:id", updateCalendarEvent);
router.delete("/calendar/:id", deleteCalendarEvent);

// ASSIGNMENTS
router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.patch("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

// ATTENDANCE
router.get("/attendance/:courseId/:date", getAttendanceByCourseAndDate);
router.post("/attendance/bulk", saveBulkAttendance);

// NOTIFICATIONS
router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);

export default router;
