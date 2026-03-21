import { Router } from "express";
import { pharmacyProfileController } from "../controllers/pharmacy.profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, pharmacyProfileController.getMyPharmacyProfile);
router.put("/me", requireAuth, pharmacyProfileController.upsertMyPharmacyProfile);

export default router;
