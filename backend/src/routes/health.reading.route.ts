import { Router } from "express";
import { healthReadingController } from "../controllers/health.reading.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, healthReadingController.addReading);
router.get("/my", requireAuth, healthReadingController.getMyReadings);
router.get("/patient/:patientId", requireAuth, requireRole(["doctor", "admin"]), healthReadingController.getPatientReadings);

export default router;
