import request from 'supertest';
import app from '../app';
import { swaggerSpec } from '../swagger';

describe('GET /api-docs', () => {
  // AC-4: Swagger UI is served at /api-docs
  it('AC-4: returns 200 HTML page for Swagger UI', async () => {
    const res = await request(app).get('/api-docs/');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('swaggerSpec paths', () => {
  // AC-4: Swagger spec must document all API endpoints so /api-docs is not empty
  it('AC-4: spec contains /api/cep/{cep} path', () => {
    const paths = (swaggerSpec as { paths?: Record<string, unknown> }).paths ?? {};
    expect(Object.keys(paths)).toContain('/api/cep/{cep}');
  });

  it('AC-4: spec contains /api/health path', () => {
    const paths = (swaggerSpec as { paths?: Record<string, unknown> }).paths ?? {};
    expect(Object.keys(paths)).toContain('/api/health');
  });
});
