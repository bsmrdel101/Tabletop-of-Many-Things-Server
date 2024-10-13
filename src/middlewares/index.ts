import type { Request, Response, NextFunction } from "express";


export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Pardon, who are you?" });
}

export function errorCatcher(err: string, req: Request, res: Response, next: NextFunction) {
  // In general, you should avoid sending the error stack trace to the client,
  // but rather log it to a file or posta payload to a dedicated logging service.
  // Please consider doing something more than this.
  console.error(err);
  return res.status(500).json({ message: "Everything is on fire." });
}
