import { Request, Response } from "express";
import * as service from "./journal.service.js";

export const createJournalTable = async ( req: Request, res: Response ) => {
  try {
    const table = await service.createJournalTable( req.body, req.user!);

    res.status(201).json(table);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const listTables = async ( req: Request, res: Response ) => {
  const data = await service.listTables({
    ...req.query,
    clinicId: req.user!.clinicId,
  });

  res.json(data);
};

export const listNotes = async ( req: Request, res: Response ) => {
  const data = await service.listNotes({
    ...req.query,
    clinicId: req.user!.clinicId,
  });

  res.json(data);
};

export const createNote = async ( req: Request, res: Response ) => {
  try {
    const note = await service.createNote(
      req.body,
      req.user!
    );

    res.status(201).json(note);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const saveNote = async ( req: Request, res: Response ) => {
  try {
    const note = await service.saveNote(
      String(req.params.id),
      req.body,
      req.user!
    );

    res.json(note);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const signNote = async ( req: Request, res: Response ) => {
  try {
    const note = await service.signNote(
      String(req.params.id),
      req.user!
    );

    res.json(note);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const voidNote = async ( req: Request, res: Response ) => {
  try {
    const note = await service.voidNote(
      String(req.params.id),
      req.body.reason,
      req.user!
    );

    res.json(note);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteNote = async ( req: Request, res: Response ) => {
  try {
    await service.removeNote(
      String(req.params.id),
      req.user!
    );

    res.json({
      success: true,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const closeTable = async ( req: Request, res: Response ) => {
  try {
    const table = await service.closeTable(
      String(req.params.id),
      req.body.reason,
      req.body.comment,
      req.user!
    );

    res.json(table);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const reopenTable = async ( req: Request, res: Response ) => {
  try {
    const table = await service.reopenTable(
      String(req.params.id),
      req.user!
    );

    res.json(table);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};