import { Request, Response, NextFunction } from 'express';
import { lookupCep } from '../services/cep.service';
import { AppError } from '../errors/AppError';

const CEP_REGEX = /^\d{8}$/;

export async function getCep(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { cep } = req.params;

  if (!CEP_REGEX.test(cep)) {
    next(new AppError(400, 'CEP deve conter exatamente 8 dígitos numéricos'));
    return;
  }

  try {
    const address = await lookupCep(cep);
    res.status(200).json(address);
  } catch (err) {
    next(err);
  }
}
