import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, college_id: user.college_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role.toLowerCase(),
        college_id: user.college_id,
        points: user.points ?? 0,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    const isDbError =
      err?.message?.toLowerCase().includes("database") ||
      err?.code?.startsWith?.("P") ||
      err?.name?.includes("Prisma");
    const errorMsg = isDbError
      ? "Database connection failed. Please ensure PostgreSQL is running."
      : "Something went wrong, try again";
    res.status(500).json({ error: errorMsg });
  }
}

export async function logout(req, res) {
  // JWT is stateless — logout is handled client-side by clearing localStorage
  res.json({ success: true });
}
