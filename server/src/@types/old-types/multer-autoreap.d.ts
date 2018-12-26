declare module "multer-autoreap" {
  import { Request, Response, NextFunction } from "express"

  interface MulterAutoReap {
    (req: Request, res: Response, next: NextFunction): void
  }

  const autoReap: MulterAutoReap
  export = autoReap
}
