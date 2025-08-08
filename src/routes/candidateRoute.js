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
const router = express.Router();

router.post("/",upload.single("resume"), createCandidate);
router.put("/:id",upload.single('resume'), updateCandidate);
router.get('/', getAllCandidates);
router.get('/status/:status', getCandidatesByStatus);
router.get("/position/:position", getCandidatesByPosition);
router.get("/search", searchCandidates);
router.delete('/:id', deleteCandidate);

export default router;