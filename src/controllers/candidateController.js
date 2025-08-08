import Candidate from "../models/candidateModel.js";
import uploadOnCloudinary from "../utils/media/uploadImage.js";
import fs from 'fs';

const createCandidate = async (req, res) => {
    try {
        const {
            fullName = "",
            email = "",
            phone = "",
            position = "",
            experience = "",
            declarationAccepted,
        } = req.body;

        if (!fullName.trim()) {
            return res.status(400).json({ message: "Full name is required." });
        }
        if (!email.trim()) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!phone.trim()) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        if (!position.trim()) {
            return res.status(400).json({ message: "Position is required." });
        }
        if (!experience.trim()) {
            return res.status(400).json({ message: "Experience is required." });
        }
        if (declarationAccepted !== true && declarationAccepted !== "true") {
            return res.status(400).json({ message: "Declaration must be accepted." });
        }
        const existing = await Candidate.findOne({ email: email.trim() });
        if (existing) {
            return res.status(400).json({ message: "Candidate already exists with this email." });
        }
        if (!req.file?.path) {
            return res.status(400).json({ error: "Resume image is required." });
        }
        const result = await uploadOnCloudinary(req.file.path);
        if (!result || !result.secure_url) {
            return res.status(400).json({ error: "Image upload failed." });
        }
        const candidate = await Candidate.create({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            position: position.trim(),
            experience: experience.trim(),
            resume: result.secure_url,
            declarationAccepted: true,
        });
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully.",
            candidate,
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const updateData = req.body || {}; // protect against undefined
    console.log("BODYDYYYY:",req.body)
    // Update `createdAt` only if explicitly provided
    if (updateData.createdAt) {
      candidate.createdAt = new Date(updateData.createdAt);
    }

    // Exclude `createdAt` from bulk update to avoid double-setting
    const { createdAt, ...otherFields } = updateData;
    Object.assign(candidate, otherFields);

    await candidate.save();

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch candidates', error: error.message });
    }
};

const getCandidatesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const candidates = await Candidate.find({ status });

        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch candidates by status', error: error.message });
    }
};

const getCandidatesByPosition = async (req, res) => {
    try {
        const { position } = req.params;
        const candidates = await Candidate.find({ position: position });
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching candidates by position', error: error.message });
    }
};

const searchCandidates = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
        }

        const regex = new RegExp(q, 'i');  // case-insensitive search
        const candidates = await Candidate.find({
            $or: [
                { fullName: regex },
                { email: regex },
                { phone: regex },
                { position: regex }
            ]
        });

        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found." });
        }
        await Candidate.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Candidate deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete candidate.",
            error: error.message,
        });
    }
};


export {
    createCandidate,
    updateCandidate,
    getAllCandidates,
    getCandidatesByStatus,
    getCandidatesByPosition,
    searchCandidates,
    deleteCandidate
};