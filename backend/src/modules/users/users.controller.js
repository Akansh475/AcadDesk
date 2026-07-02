import prisma from "../../config/prisma.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile_photo: true,
        university_roll_no: true,
        student_id: true,
        year: true,
        section: true,
        cgpa: true,
        course: true,
        branch: true,
        role: true,
        college_id: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { phone, profile_photo } = req.body;

    // Only phone and profile_photo are editable
    const data = {};
    if (phone !== undefined) data.phone = phone;
    if (profile_photo !== undefined) data.profile_photo = profile_photo;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No editable fields provided" });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile_photo: true,
        university_roll_no: true,
        student_id: true,
        year: true,
        section: true,
        cgpa: true,
        course: true,
        branch: true,
        role: true,
        college_id: true,
      },
    });

    res.json(user);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("updateUser error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}