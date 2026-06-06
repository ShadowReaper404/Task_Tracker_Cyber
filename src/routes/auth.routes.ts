import { Router } from "express";
import { isGuest, isAuthenticated } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} from "../controllers/auth.controller";

const router = Router();

router.get("/register", isGuest, getRegister);
router.post("/register", isGuest, authLimiter, validate(registerSchema), postRegister);

router.get("/login", isGuest, getLogin);
router.post("/login", isGuest, authLimiter, validate(loginSchema), postLogin);

router.post("/logout", isAuthenticated, logout);

export default router;
