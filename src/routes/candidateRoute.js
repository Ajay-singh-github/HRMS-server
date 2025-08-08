import express from "express";
import {
  createCandidate,
  updateCandidate,
  getAllCandidates,
  getCandidatesByStatus,
  getCandidatesByPosition,
  searchCandidates,
  deleteCandidate
} from "../controllers/candidateController.js";
import { upload } from "../middlewares/multer.js";
import authenticate from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/",upload.single("resume"),authenticate, createCandidate);
router.put("/:id",upload.single('resume'),authenticate, updateCandidate);
router.get('/',authenticate, getAllCandidates);
router.get('/status/:status',authenticate, getCandidatesByStatus);
router.get("/position/:position",authenticate, getCandidatesByPosition);
router.get("/search",authenticate, searchCandidates);
router.delete('/:id',authenticate, deleteCandidate);

export default router;