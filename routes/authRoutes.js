import express from "express";
import cors from "cors";
import {
  test,
  registerUsers,
  loginUsers,
  update,
} from "../controllers/authController.js";
import { webhook } from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = new express.Router();

// router.use(
//     cors({
//         credentials:true,
//         origin:"http"
//     })
// )
router.use(cors());

router.get("/", test);
router.post("/api/register", registerUsers);
router.post("/api/login", loginUsers);
router.put("/api/update", protect, update);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default router;
