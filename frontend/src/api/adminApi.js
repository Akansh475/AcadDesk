import dayjs from "dayjs";

const STORAGE_KEY = "acaddesk_admin_mock_data_v1";
const MOCK_DELAY = 220;

// Helper for simulated network delay
const delay = (ms = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate initial mock data
function generateInitialData() {
  const courses = [
    {
      id: "course-cs301",
      code: "CS301",
      name: "Computer Networks",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(60, "day").toISOString(),
    },
    {
      id: "course-cs302",
      code: "CS302",
      name: "Operating Systems",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(60, "day").toISOString(),
    },
    {
      id: "course-cs303",
      code: "CS303",
      name: "Database Management Systems",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(60, "day").toISOString(),
    },
    {
      id: "course-cs304",
      code: "CS304",
      name: "Design and Analysis of Algorithms",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(50, "day").toISOString(),
    },
    {
      id: "course-cs401",
      code: "CS401",
      name: "Machine Learning & AI",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(45, "day").toISOString(),
    },
    {
      id: "course-cs402",
      code: "CS402",
      name: "Cloud Computing & DevOps",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(40, "day").toISOString(),
    },
    {
      id: "course-cs403",
      code: "CS403",
      name: "Cyber Security & Cryptography",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(30, "day").toISOString(),
    },
    {
      id: "course-cs404",
      code: "CS404",
      name: "Web Technologies & Frameworks",
      college_id: "c1",
      department: "Information Technology",
      created_at: dayjs().subtract(25, "day").toISOString(),
    },
    {
      id: "course-empty",
      code: "CS499",
      name: "Special Topics in Quantum Computing (New)",
      college_id: "c1",
      department: "Computer Science",
      created_at: dayjs().subtract(5, "day").toISOString(),
    },
  ];

  const firstNames = [
    "Aarav", "Aditi", "Akash", "Ananya", "Aryan", "Bhavya", "Chirag", "Deepika",
    "Devansh", "Divya", "Eshan", "Gaurav", "Harsh", "Isha", "Ishaan", "Jatin",
    "Kavya", "Karan", "Kunal", "Manish", "Meera", "Mohit", "Neha", "Nikhil",
    "Pooja", "Pranav", "Priya", "Rahul", "Rhea", "Rishabh", "Rohan", "Sakshi",
    "Sameer", "Sanya", "Shaurya", "Shivam", "Shreya", "Siddharth", "Sneha", "Tanmay",
    "Tanvi", "Utkarsh", "Vaibhav", "Varun", "Vedant", "Vidhi", "Vikram", "Yash"
  ];

  const lastNames = [
    "Sharma", "Verma", "Gupta", "Malhotra", "Mehta", "Bhatia", "Kapoor", "Chopra",
    "Saxena", "Singh", "Patel", "Joshi", "Mishra", "Pandey", "Agarwal", "Bansal",
    "Reddy", "Nair", "Iyer", "Rao", "Chauhan", "Rawat", "Bisht", "Negi", "Dubey"
  ];

  const branches = ["Computer Science", "Information Technology", "Electronics & Comm."];
  const sections = ["A", "B", "C"];
  const years = ["3rd Year", "4th Year", "2nd Year"];

  const students = [];
  const totalCount = 140; // realistic large pool to demonstrate server-side pagination with 50/page

  for (let i = 1; i <= totalCount; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(i - 1 + Math.floor(i / firstNames.length)) % lastNames.length];
    const name = `${fn} ${ln}`;
    const rollNum = (210120101000 + i).toString();
    const studentId = `STU${2021000 + i}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gehu.ac.in`;
    const branch = branches[i % branches.length];
    const section = sections[i % sections.length];
    const year = years[i % years.length];
    const cgpa = (7.1 + ((i * 17) % 28) / 10).toFixed(2);
    const phone = `+91 98${(10000000 + (i * 73921) % 89999999).toString().slice(0, 8)}`;
    
    // Assign course enrollments (except the CS499 empty course)
    const enrolledCourseIds = [
      "course-cs301",
      "course-cs302",
      "course-cs303",
      "course-cs304",
      i % 2 === 0 ? "course-cs401" : "course-cs402",
      i % 3 === 0 ? "course-cs403" : "course-cs404",
    ];

    students.push({
      id: `std-${i}`,
      name,
      email,
      university_roll_no: rollNum,
      student_id: studentId,
      branch,
      course: "B.Tech CSE",
      year,
      section,
      cgpa,
      phone,
      enrolled_courses: enrolledCourseIds,
      created_at: dayjs().subtract(i, "day").toISOString(),
    });
  }

  const calendarEvents = [
    {
      id: "cal-1",
      college_id: "c1",
      title: "Mid Term Theory Examinations",
      type: "exam",
      date: dayjs().add(5, "day").format("YYYY-MM-DD"),
      course_id: null,
      course_name: "All Courses",
    },
    {
      id: "cal-2",
      college_id: "c1",
      title: "DBMS Lab Practical Assessment",
      type: "practical",
      date: dayjs().add(8, "day").format("YYYY-MM-DD"),
      course_id: "course-cs303",
      course_name: "Database Management Systems",
    },
    {
      id: "cal-3",
      college_id: "c1",
      title: "Project-Based Learning (PBL) Phase 1 Evaluation",
      type: "pbl",
      date: dayjs().add(14, "day").format("YYYY-MM-DD"),
      course_id: null,
      course_name: "All Courses",
    },
    {
      id: "cal-4",
      college_id: "c1",
      title: "University Foundation Day & Cultural Holiday",
      type: "holiday",
      date: dayjs().add(20, "day").format("YYYY-MM-DD"),
      course_id: null,
      course_name: "All Courses (College-wide)",
    },
    {
      id: "cal-5",
      college_id: "c1",
      title: "Operating Systems End-Term Practical",
      type: "practical",
      date: dayjs().add(32, "day").format("YYYY-MM-DD"),
      course_id: "course-cs302",
      course_name: "Operating Systems",
    },
    {
      id: "cal-6",
      college_id: "c1",
      title: "Final Semester Theory Examinations",
      type: "exam",
      date: dayjs().add(45, "day").format("YYYY-MM-DD"),
      course_id: null,
      course_name: "All Courses",
    },
  ];

  const assignments = [
    {
      id: "asg-1",
      course_id: "course-cs301",
      course_name: "Computer Networks",
      title: "Dijkstra's Routing Algorithm Implementation",
      description: "Implement Dijkstra's shortest path routing algorithm in C++/Python with simulation on a 6-node topology.",
      due_date: dayjs().add(3, "day").format("YYYY-MM-DD"),
      marks: 20,
      status: "Active",
      submissions_count: 42,
      file_name: "CN_Lab_Assignment_Dijkstra.pdf",
      file_size: "1.2 MB",
      file_url: "#",
    },
    {
      id: "asg-2",
      course_id: "course-cs301",
      course_name: "Computer Networks",
      title: "IPv4 Subnetting & CIDR Calculation Sheet",
      description: "Complete all subnet allocation exercises and calculate network & broadcast addresses.",
      due_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
      marks: 10,
      status: "Active",
      submissions_count: 18,
      file_name: "Subnetting_CIDR_Worksheet.pdf",
      file_size: "850 KB",
      file_url: "#",
    },
    {
      id: "asg-3",
      course_id: "course-cs302",
      course_name: "Operating Systems",
      title: "Process Scheduling Algorithms Simulator",
      description: "Write code to simulate FCFS, SJF, and Round Robin CPU scheduling and compare turnaround times.",
      due_date: dayjs().add(5, "day").format("YYYY-MM-DD"),
      marks: 25,
      status: "Active",
      submissions_count: 64,
      file_name: null,
      file_size: null,
      file_url: null,
    },
    {
      id: "asg-4",
      course_id: "course-cs303",
      course_name: "Database Management Systems",
      title: "ER Modeling and 3NF Normalization Case Study",
      description: "Design an ER schema for a multi-specialty hospital management system and normalize to BCNF.",
      due_date: dayjs().add(2, "day").format("YYYY-MM-DD"),
      marks: 15,
      status: "Active",
      submissions_count: 85,
      file_name: "DBMS_Hospital_CaseStudy.pdf",
      file_size: "2.4 MB",
      file_url: "#",
    },
    {
      id: "asg-5",
      course_id: "course-cs401",
      course_name: "Machine Learning & AI",
      title: "Linear & Logistic Regression from Scratch",
      description: "Implement gradient descent optimization without using scikit-learn on the provided student dataset.",
      due_date: dayjs().add(10, "day").format("YYYY-MM-DD"),
      marks: 30,
      status: "Active",
      submissions_count: 22,
    },
  ];

  const notifications = [
    {
      id: "notif-1",
      title: "Mid-Term Theory Exam Schedule Released",
      message: "The finalized Mid-Term examination schedule has been published. Exams commence on 10th October. Check your hall tickets on the portal.",
      type: "exam",
      source: "SYSTEM",
      target: "All Students",
      created_at: dayjs().subtract(1, "day").toISOString(),
    },
    {
      id: "notif-2",
      title: "Upcoming University Holiday Notice",
      message: "The university will remain closed on Friday for Founder's Day. No academic or practical sessions will be held.",
      type: "holiday",
      source: "SYSTEM",
      target: "All Students",
      created_at: dayjs().subtract(3, "day").toISOString(),
    },
    {
      id: "notif-3",
      title: "Annual Hackathon 2026 Registration Open",
      message: "Registrations are now live for the 48-hour Annual Inter-College Hackathon. Teams of up to 4 can register via the portal.",
      type: "event",
      source: "SYSTEM",
      target: "All Students",
      created_at: dayjs().subtract(5, "day").toISOString(),
    },
    {
      id: "notif-4",
      title: "Library Book Return Deadline Extension",
      message: "All students are informed that book return due dates have been extended by 7 days without penalty.",
      type: "announcement",
      source: "SYSTEM",
      target: "All Students",
      created_at: dayjs().subtract(8, "day").toISOString(),
    },
  ];

  // Attendance store: map of `${course_id}_${date}` -> array of { student_id, status: 'PRESENT' | 'ABSENT' }
  const attendanceStore = {};

  return {
    students,
    courses,
    calendarEvents,
    assignments,
    notifications,
    attendanceStore,
  };
}

// Load data from localStorage or initialize
function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading admin store:", e);
  }
  const initial = generateInitialData();
  saveStore(initial);
  return initial;
}

function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving admin store:", e);
  }
}

// ==========================================
// 1. STUDENTS API
// ==========================================
export const adminStudentsApi = {
  /**
   * GET /api/admin/students (Paginated with search)
   */
  async getStudents({ page = 1, limit = 50, search = "", branch = "", year = "" } = {}) {
    await delay();
    const store = getStore();
    let filtered = [...store.students];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.university_roll_no.toLowerCase().includes(q) ||
          s.student_id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    if (branch) {
      filtered = filtered.filter((s) => s.branch === branch);
    }

    if (year) {
      filtered = filtered.filter((s) => s.year === year);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (currentPage - 1) * limit;
    const paginatedStudents = filtered.slice(startIndex, startIndex + limit);

    return {
      students: paginatedStudents,
      total,
      page: currentPage,
      limit,
      totalPages,
    };
  },

  /**
   * Check if student has associated attendance or assignment records
   */
  async checkStudentHasRecords(studentId) {
    await delay(80);
    const store = getStore();
    let attendanceCount = 0;
    
    // Check in attendanceStore
    for (const key in store.attendanceStore) {
      const records = store.attendanceStore[key] || [];
      if (records.some((r) => r.student_id === studentId)) {
        attendanceCount++;
      }
    }

    return {
      hasAttendance: attendanceCount > 0,
      hasAssignments: true, // typical active enrolled student
      attendanceCount,
    };
  },

  /**
   * POST /api/admin/students
   */
  async createStudent(payload) {
    await delay();
    const store = getStore();

    // Check duplicate roll number or email
    const duplicateRoll = store.students.find(
      (s) => s.university_roll_no.trim().toLowerCase() === payload.university_roll_no.trim().toLowerCase()
    );
    if (duplicateRoll) {
      throw new Error(`University Roll No ${payload.university_roll_no} already belongs to ${duplicateRoll.name}`);
    }

    const duplicateEmail = store.students.find(
      (s) => s.email.trim().toLowerCase() === payload.email.trim().toLowerCase()
    );
    if (duplicateEmail) {
      throw new Error(`Email ${payload.email} is already registered.`);
    }

    const newId = `std-${Date.now()}`;
    const newStudent = {
      id: newId,
      name: payload.name.trim(),
      email: payload.email.trim(),
      university_roll_no: payload.university_roll_no.trim(),
      student_id: payload.student_id?.trim() || `STU${Math.floor(100000 + Math.random() * 900000)}`,
      branch: payload.branch || "Computer Science",
      course: payload.course || "B.Tech CSE",
      year: payload.year || "1st Year",
      section: payload.section || "A",
      cgpa: payload.cgpa ? parseFloat(payload.cgpa).toFixed(2) : "0.00",
      phone: payload.phone?.trim() || "",
      enrolled_courses: payload.enrolled_courses || store.courses.slice(0, 4).map((c) => c.id),
      created_at: new Date().toISOString(),
    };

    store.students.unshift(newStudent);
    saveStore(store);
    return newStudent;
  },

  /**
   * PATCH /api/admin/students/:id
   */
  async updateStudent(id, payload) {
    await delay();
    const store = getStore();
    const index = store.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Student not found.");
    }

    // Check duplicate roll number on other students
    if (payload.university_roll_no) {
      const duplicateRoll = store.students.find(
        (s) => s.id !== id && s.university_roll_no.trim().toLowerCase() === payload.university_roll_no.trim().toLowerCase()
      );
      if (duplicateRoll) {
        throw new Error(`University Roll No ${payload.university_roll_no} is already assigned to another student.`);
      }
    }

    const updated = {
      ...store.students[index],
      ...payload,
      id, // protect ID
    };

    store.students[index] = updated;
    saveStore(store);
    return updated;
  },

  /**
   * DELETE /api/admin/students/:id
   */
  async deleteStudent(id) {
    await delay();
    const store = getStore();
    const beforeCount = store.students.length;
    store.students = store.students.filter((s) => s.id !== id);
    
    if (store.students.length === beforeCount) {
      throw new Error("Student not found.");
    }

    // Clean up attendance records for this student
    for (const key in store.attendanceStore) {
      if (Array.isArray(store.attendanceStore[key])) {
        store.attendanceStore[key] = store.attendanceStore[key].filter(
          (r) => r.student_id !== id
        );
      }
    }

    saveStore(store);
    return { success: true, id };
  },
};

// ==========================================
// 2. COURSES API
// ==========================================
export const adminCoursesApi = {
  /**
   * GET /api/admin/courses
   */
  async getCourses() {
    await delay();
    const store = getStore();
    return [...store.courses];
  },

  /**
   * POST /api/admin/courses
   */
  async createCourse(payload) {
    await delay();
    const store = getStore();

    const normalizedCode = payload.code.trim().toUpperCase();
    const duplicate = store.courses.find(
      (c) => c.code.trim().toUpperCase() === normalizedCode
    );

    if (duplicate) {
      throw new Error("Course code already exists");
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      code: normalizedCode,
      name: payload.name.trim(),
      college_id: payload.college_id || "c1",
      department: payload.department?.trim() || "Computer Science",
      created_at: new Date().toISOString(),
    };

    store.courses.unshift(newCourse);
    saveStore(store);
    return newCourse;
  },

  /**
   * PATCH /api/admin/courses/:id
   */
  async updateCourse(id, payload) {
    await delay();
    const store = getStore();
    const index = store.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Course not found.");
    }

    if (payload.code) {
      const normalizedCode = payload.code.trim().toUpperCase();
      const duplicate = store.courses.find(
        (c) => c.id !== id && c.code.trim().toUpperCase() === normalizedCode
      );
      if (duplicate) {
        throw new Error("Course code already exists");
      }
      payload.code = normalizedCode;
    }

    const updated = {
      ...store.courses[index],
      ...payload,
      id,
    };

    store.courses[index] = updated;
    saveStore(store);
    return updated;
  },

  /**
   * DELETE /api/admin/courses/:id
   */
  async deleteCourse(id) {
    await delay();
    const store = getStore();
    store.courses = store.courses.filter((c) => c.id !== id);
    saveStore(store);
    return { success: true, id };
  },
};

// ==========================================
// 3. CALENDAR API
// ==========================================
export const adminCalendarApi = {
  /**
   * GET /api/admin/calendar
   */
  async getCalendarEvents() {
    await delay();
    const store = getStore();
    return [...store.calendarEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /**
   * POST /api/admin/calendar
   */
  async createCalendarEvent(payload) {
    await delay();
    const store = getStore();

    let courseName = "All Courses (College-wide)";
    if (payload.course_id) {
      const course = store.courses.find((c) => c.id === payload.course_id);
      courseName = course ? `${course.code} - ${course.name}` : "Selected Course";
    }

    const newEvent = {
      id: `cal-${Date.now()}`,
      college_id: payload.college_id || "c1",
      title: payload.title.trim(),
      type: payload.type, // 'exam' | 'practical' | 'pbl' | 'holiday'
      date: payload.date,
      course_id: payload.course_id || null,
      course_name: courseName,
      created_at: new Date().toISOString(),
    };

    store.calendarEvents.push(newEvent);
    saveStore(store);
    return newEvent;
  },

  /**
   * PATCH /api/admin/calendar/:id
   */
  async updateCalendarEvent(id, payload) {
    await delay();
    const store = getStore();
    const index = store.calendarEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error("Calendar event not found.");
    }

    let courseName = store.calendarEvents[index].course_name;
    if (payload.course_id !== undefined) {
      if (payload.course_id) {
        const course = store.courses.find((c) => c.id === payload.course_id);
        courseName = course ? `${course.code} - ${course.name}` : "Selected Course";
      } else {
        courseName = "All Courses (College-wide)";
      }
    }

    const updated = {
      ...store.calendarEvents[index],
      ...payload,
      course_name: courseName,
      id,
    };

    store.calendarEvents[index] = updated;
    saveStore(store);
    return updated;
  },

  /**
   * DELETE /api/admin/calendar/:id
   */
  async deleteCalendarEvent(id) {
    await delay();
    const store = getStore();
    store.calendarEvents = store.calendarEvents.filter((e) => e.id !== id);
    saveStore(store);
    return { success: true, id };
  },
};

// ==========================================
// 4. ASSIGNMENTS API
// ==========================================
export const adminAssignmentsApi = {
  /**
   * GET /api/admin/assignments
   */
  async getAssignments() {
    await delay();
    const store = getStore();
    return [...store.assignments].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  },

  /**
   * POST /api/admin/assignments
   */
  async createAssignment(payload) {
    await delay();
    const store = getStore();

    const course = store.courses.find((c) => c.id === payload.course_id);
    const courseName = course ? `${course.code} - ${course.name}` : "General Subject";

    const newAssignment = {
      id: `asg-${Date.now()}`,
      course_id: payload.course_id,
      course_name: courseName,
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      due_date: payload.due_date,
      marks: parseInt(payload.marks, 10) || 0,
      status: "Active",
      submissions_count: 0,
      file_name: payload.file_name || null,
      file_size: payload.file_size || null,
      file_url: payload.file_url || null,
      created_at: new Date().toISOString(),
    };

    store.assignments.unshift(newAssignment);
    saveStore(store);
    return newAssignment;
  },

  /**
   * PATCH /api/admin/assignments/:id
   */
  async updateAssignment(id, payload) {
    await delay();
    const store = getStore();
    const index = store.assignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Assignment not found.");
    }

    let courseName = store.assignments[index].course_name;
    if (payload.course_id) {
      const course = store.courses.find((c) => c.id === payload.course_id);
      if (course) courseName = `${course.code} - ${course.name}`;
    }

    const updated = {
      ...store.assignments[index],
      ...payload,
      course_name: courseName,
      marks: payload.marks !== undefined ? parseInt(payload.marks, 10) : store.assignments[index].marks,
      file_name: payload.file_name !== undefined ? payload.file_name : store.assignments[index].file_name,
      file_size: payload.file_size !== undefined ? payload.file_size : store.assignments[index].file_size,
      file_url: payload.file_url !== undefined ? payload.file_url : store.assignments[index].file_url,
      id,
    };

    store.assignments[index] = updated;
    saveStore(store);
    return updated;
  },

  /**
   * DELETE /api/admin/assignments/:id
   */
  async deleteAssignment(id) {
    await delay();
    const store = getStore();
    store.assignments = store.assignments.filter((a) => a.id !== id);
    saveStore(store);
    return { success: true, id };
  },
};

// ==========================================
// 5. ATTENDANCE API (Bulk Marking)
// ==========================================
export const adminAttendanceApi = {
  /**
   * GET /api/admin/attendance/:courseId/:date
   * Loads enrolled students + their attendance status for that date
   */
  async getAttendanceByCourseAndDate(courseId, date) {
    await delay();
    const store = getStore();

    if (!courseId) {
      throw new Error("Course ID is required");
    }

    // Find students enrolled in this course
    const enrolledStudents = store.students.filter((s) => {
      if (Array.isArray(s.enrolled_courses)) {
        return s.enrolled_courses.includes(courseId);
      }
      return true;
    });

    const key = `${courseId}_${date}`;
    const existingRecords = store.attendanceStore[key] || [];
    const statusMap = new Map(existingRecords.map((r) => [r.student_id, r.status]));

    // Construct the list with defaults to 'PRESENT'
    const studentRecords = enrolledStudents.map((student) => ({
      student_id: student.id,
      name: student.name,
      university_roll_no: student.university_roll_no,
      student_id_code: student.student_id,
      branch: student.branch,
      section: student.section,
      status: statusMap.get(student.id) || "PRESENT",
    }));

    return {
      course_id: courseId,
      date,
      total_enrolled: enrolledStudents.length,
      records: studentRecords,
      has_saved_records: existingRecords.length > 0,
    };
  },

  /**
   * POST /api/admin/attendance/bulk
   * Atomic bulk save
   */
  async saveBulkAttendance({ course_id, date, records }) {
    await delay(300);
    const store = getStore();

    if (!course_id || !date || !Array.isArray(records)) {
      throw new Error("Invalid attendance payload. Course ID, Date, and Records array are required.");
    }

    // Atomic update
    const key = `${course_id}_${date}`;
    store.attendanceStore[key] = records.map((r) => ({
      student_id: r.student_id,
      status: r.status === "ABSENT" ? "ABSENT" : "PRESENT",
      updated_at: new Date().toISOString(),
    }));

    saveStore(store);

    return {
      success: true,
      message: `Successfully saved attendance for ${records.length} students on ${date}.`,
      course_id,
      date,
      count: records.length,
    };
  },
};

// ==========================================
// 6. NOTIFICATIONS API (Broadcast)
// ==========================================
export const adminNotificationsApi = {
  /**
   * GET /api/admin/notifications
   */
  async getNotifications() {
    await delay();
    const store = getStore();
    return [...store.notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  /**
   * POST /api/admin/notifications
   * Broadcasts to ALL students
   */
  async createNotification(payload) {
    await delay();
    const store = getStore();

    const newNotification = {
      id: `notif-${Date.now()}`,
      title: payload.title.trim(),
      message: payload.message.trim(),
      type: payload.type || "announcement", // 'exam' | 'holiday' | 'event' | 'announcement'
      source: "SYSTEM",
      target: "All Students",
      created_at: new Date().toISOString(),
    };

    store.notifications.unshift(newNotification);
    saveStore(store);
    return newNotification;
  },

  /**
   * PATCH /api/admin/notifications/:id
   */
  async updateNotification(id, payload) {
    await delay();
    const store = getStore();
    const index = store.notifications.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error("Notification not found.");
    }

    const updated = {
      ...store.notifications[index],
      ...payload,
      id,
    };

    store.notifications[index] = updated;
    saveStore(store);
    return updated;
  },

  /**
   * DELETE /api/admin/notifications/:id
   */
  async deleteNotification(id) {
    await delay();
    const store = getStore();
    store.notifications = store.notifications.filter((n) => n.id !== id);
    saveStore(store);
    return { success: true, id };
  },
};
