import { Router } from "express";
import * as controller from "./journal.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createJournalNoteSchema, closeJournalTableSchema, createJournalTableSchema, } from "./journal.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

// TABLES
router.post( "/tables", requireRoles( Roles.Doctor, Roles.Nurse), validate(createJournalTableSchema), controller.createJournalTable );
router.get("/tables", requireRoles( Roles.Doctor, Roles.Nurse), controller.listTables);
router.post( "/tables/:id/close", requireRoles( Roles.Doctor,   ), validate(closeJournalTableSchema), controller.closeTable );
router.post("/tables/:id/reopen", requireRoles( Roles.Doctor,  ), controller.reopenTable);

// NOTES
router.get("/notes", requireRoles( Roles.Doctor, Roles.Nurse), controller.listNotes);
router.post( "/notes", requireRoles( Roles.Doctor, Roles.Nurse), validate(createJournalNoteSchema), controller.createNote );

router.patch("/notes/:id",requireRoles( Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse), controller.saveNote);
router.post("/notes/:id/sign", requireRoles( Roles.ClinicAdmin, Roles.Doctor, ), controller.signNote);
router.post("/notes/:id/void", requireRoles(  Roles.ClinicAdmin, Roles.Doctor, ), controller.voidNote);
router.delete("/notes/:id", requireRoles( Roles.Doctor,  Roles.ClinicAdmin), controller.deleteNote);

export default router;