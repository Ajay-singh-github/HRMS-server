import Admin from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { setToken, removeToken } from "../utils/auth/token.js";

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return res.status(400).json({ message: "Name is required and must be at least 3 characters" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Read - Get all admins
const getAllAdmins = async (_, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({ message: "Admins fetched successfully", data: admins });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Read - Get single admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin fetched successfully", data: admin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", data: admin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = setToken(admin._id, res);
    const adminData = { ...admin._doc };
    delete adminData.password;
    res.status(200).json({
      message: "Admin logged in successfully",
      data: adminData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin
};
