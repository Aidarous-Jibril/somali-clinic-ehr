export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        accountId: string;
        personId: string;
        clinicId: string;
        unitId: string | null;
        teamId: string | null;
        role: string;
      };
    }
  }
}