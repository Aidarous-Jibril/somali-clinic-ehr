import { Router } from "express";
import { prisma } from "../../config/prisma.js";

const router = Router();

// DEV ONLY: create clinic
router.post("/", async (req, res) => {
  const clinic = await prisma.clinic.create({
    data: {
      name: req.body.name,
      code: req.body.code,
    },
  });

  res.status(201).json(clinic);
});

export default router;
