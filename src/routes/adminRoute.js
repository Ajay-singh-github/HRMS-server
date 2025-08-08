import { Router } from "express";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin
} from "../controllers/adminController.js";
import authenticate from "../middlewares/authMiddleware.js";
import { removeToken } from "../utils/auth/token.js";

const router = Router();

router.post('/', createAdmin);
router.post('/login', loginAdmin);
router.get('/',authenticate, getAllAdmins);
router.get('/:id', getAdminById);
router.put('/',authenticate, updateAdmin);
router.delete('/',authenticate, deleteAdmin);
router.get('/verify/verify', authenticate, async (req, res) => {
  res.status(200).json({
    message: 'Welcome to protected dashboard',
    userId: req.userId,
  });
});
router.get('/admin/logout', (req, res) => {
  removeToken(res);
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
