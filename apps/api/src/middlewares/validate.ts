import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Usamos ZodSchema que es 100% compatible con cualquier versión de Zod
export const validateSchema = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // En Zod estricto, usamos error.issues
        res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: error.issues.map(err => ({
            campo: err.path.join('.'),
            mensaje: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};