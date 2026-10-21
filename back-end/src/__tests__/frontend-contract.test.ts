/**
 * Frontend contract tests
 *
 * The human gate HG-002 resolved that this project is backend-only (no frontend
 * layer will be implemented). AC-6 and AC-7 are [frontend] criteria routed to the
 * backend engineer because there is no frontend engineer in this squad.
 *
 * These tests prove the API contract that would enable the described frontend
 * behaviour: the backend returns the correct data shape (AC-6) and the correct
 * error responses (AC-7) that any consuming frontend could use to satisfy those
 * acceptance criteria.
 */

import request from 'supertest';
import app from '../app';
import * as cepService from '../services/cep.service';
import { AppError } from '../errors/AppError';

jest.mock('../services/cep.service');
const mockedLookupCep = cepService.lookupCep as jest.MockedFunction<
  typeof cepService.lookupCep
>;

const mockAddress = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  complemento: 'lado ímpar',
  bairro: 'Sé',
  cidade: 'São Paulo',
  estado: 'SP',
};

afterEach(() => {
  jest.clearAllMocks();
});

// AC-6: A tela possui um campo de entrada para o CEP e um botão de busca;
//       ao submeter, o resultado do endereço é exibido na tela.
//       (backend concern: the API returns all address fields required for display)
describe('AC-6: API returns address data for frontend display', () => {
  it('AC-6: returns 200 with all displayable address fields for a valid CEP', async () => {
    mockedLookupCep.mockResolvedValue(mockAddress);

    const res = await request(app).get('/api/cep/01001000');

    expect(res.status).toBe(200);
    // All fields a frontend search result would display must be present
    expect(res.body).toHaveProperty('cep');
    expect(res.body).toHaveProperty('logradouro');
    expect(res.body).toHaveProperty('complemento');
    expect(res.body).toHaveProperty('bairro');
    expect(res.body).toHaveProperty('cidade');
    expect(res.body).toHaveProperty('estado');
  });

  it('AC-6: address fields are strings so a frontend can render them directly', async () => {
    mockedLookupCep.mockResolvedValue(mockAddress);

    const res = await request(app).get('/api/cep/01001000');

    expect(res.status).toBe(200);
    expect(typeof res.body.cep).toBe('string');
    expect(typeof res.body.logradouro).toBe('string');
    expect(typeof res.body.bairro).toBe('string');
    expect(typeof res.body.cidade).toBe('string');
    expect(typeof res.body.estado).toBe('string');
  });
});

// AC-7: Quando a API retorna erro (400 ou 404), a tela exibe a mensagem de erro
//       ao usuário.
//       (backend concern: the API returns structured error responses with a
//        human-readable message that a frontend can display)
describe('AC-7: API returns structured error responses for frontend error display', () => {
  it('AC-7: returns 400 with an error message for an invalid CEP format', async () => {
    const res = await request(app).get('/api/cep/123');

    expect(res.status).toBe(400);
    // Frontend must have a non-empty string to show the user
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  it('AC-7: returns 404 with an error message when the CEP is not found', async () => {
    mockedLookupCep.mockRejectedValue(new AppError(404, 'CEP não encontrado'));

    const res = await request(app).get('/api/cep/00000000');

    expect(res.status).toBe(404);
    // Frontend must have a non-empty string to show the user
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });
});
