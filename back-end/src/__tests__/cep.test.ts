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

describe('GET /api/cep/:cep', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // AC-1: valid CEP returns 200 with address fields
  it('AC-1: returns 200 and address for a valid 8-digit CEP', async () => {
    mockedLookupCep.mockResolvedValue(mockAddress);

    const res = await request(app).get('/api/cep/01001000');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      cep: expect.any(String),
      logradouro: expect.any(String),
      complemento: expect.any(String),
      bairro: expect.any(String),
      cidade: expect.any(String),
      estado: expect.any(String),
    });
    expect(mockedLookupCep).toHaveBeenCalledWith('01001000');
  });

  // AC-1: check all required fields are present
  it('AC-1: response contains all required address fields', async () => {
    mockedLookupCep.mockResolvedValue(mockAddress);

    const res = await request(app).get('/api/cep/01001000');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cep');
    expect(res.body).toHaveProperty('logradouro');
    expect(res.body).toHaveProperty('complemento');
    expect(res.body).toHaveProperty('bairro');
    expect(res.body).toHaveProperty('cidade');
    expect(res.body).toHaveProperty('estado');
  });

  // AC-2: invalid format returns 400
  it('AC-2: returns 400 for a CEP with fewer than 8 digits', async () => {
    const res = await request(app).get('/api/cep/1234567');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(mockedLookupCep).not.toHaveBeenCalled();
  });

  it('AC-2: returns 400 for a CEP with letters', async () => {
    const res = await request(app).get('/api/cep/0100100a');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(mockedLookupCep).not.toHaveBeenCalled();
  });

  it('AC-2: returns 400 for a CEP with special characters', async () => {
    const res = await request(app).get('/api/cep/01001-00');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(mockedLookupCep).not.toHaveBeenCalled();
  });

  it('AC-2: returns 400 for a CEP with more than 8 digits', async () => {
    const res = await request(app).get('/api/cep/010010001');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(mockedLookupCep).not.toHaveBeenCalled();
  });

  it('AC-2: error message is descriptive for invalid format', async () => {
    const res = await request(app).get('/api/cep/abc');

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  // AC-3: valid format but CEP not found returns 404
  it('AC-3: returns 404 for a valid-format CEP that does not exist', async () => {
    mockedLookupCep.mockRejectedValue(new AppError(404, 'CEP não encontrado'));

    const res = await request(app).get('/api/cep/00000000');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('AC-3: error message is descriptive for not-found CEP', async () => {
    mockedLookupCep.mockRejectedValue(new AppError(404, 'CEP não encontrado'));

    const res = await request(app).get('/api/cep/00000000');

    expect(res.status).toBe(404);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  it('returns 500 when ViaCEP is unavailable', async () => {
    mockedLookupCep.mockRejectedValue(
      new AppError(500, 'Erro interno ao consultar o CEP'),
    );

    const res = await request(app).get('/api/cep/01001000');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('cepService.lookupCep unit tests', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('AC-1: maps ViaCEP response fields correctly', async () => {
    const viaCepData = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(viaCepData),
    } as Response);

    const { lookupCep } = jest.requireActual<typeof cepService>(
      '../services/cep.service',
    );
    const result = await lookupCep('01001000');

    expect(result.cidade).toBe('São Paulo');
    expect(result.estado).toBe('SP');
    expect(result.cep).toBe('01001-000');
  });

  it('AC-3: throws 404 AppError when ViaCEP returns erro:true', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ erro: true }),
    } as Response);

    const { lookupCep } = jest.requireActual<typeof cepService>(
      '../services/cep.service',
    );

    await expect(lookupCep('00000000')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 500 AppError when fetch fails', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Network error'));

    const { lookupCep } = jest.requireActual<typeof cepService>(
      '../services/cep.service',
    );

    await expect(lookupCep('01001000')).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});
