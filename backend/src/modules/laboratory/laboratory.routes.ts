// //laboraroty.routes.ts
import { Router } from "express";

import dashboardRoutes from "../dashboard/laboratory/index.js";

const router = Router();

router.use("/worklist", dashboardRoutes);

// future
// router.use("/results", resultsRoutes);
// router.use("/verify", verifyRoutes);

export default router;