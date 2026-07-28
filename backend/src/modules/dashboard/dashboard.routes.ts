// dashboard/dashboard.routes.ts
import { Router } from "express";

// import doctorRoutes from "./doctor/index.js";
import nurseRoutes from "./nurse/index.js";
import laboratoryRoutes from "./laboratory/index.js";
import radiologyRoutes from "./radiology/index.js";

const router = Router();

// router.use("/doctor", doctorRoutes);
router.use("/nurse", nurseRoutes);
router.use("/laboratory", laboratoryRoutes);
router.use("/radiology", radiologyRoutes);

export default router;