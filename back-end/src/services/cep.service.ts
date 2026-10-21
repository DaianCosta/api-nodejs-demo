import { Address } from '../models/cep.model';
import { AppError } from '../errors/AppError';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function lookupCep(cep: string): Promise<Address> {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new AppError(500, 'Erro interno ao consultar o CEP');
  }

  if (!response.ok) {
    throw new AppError(500, 'Erro interno ao consultar o CEP');
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro === true) {
    throw new AppError(404, 'CEP não encontrado');
  }

  return {
    cep: data.cep,
    logradouro: data.logradouro,
    complemento: data.complemento,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
}
