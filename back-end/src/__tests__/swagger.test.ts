import request from 'supertest';
import app from '../app';

describe('GET /api-docs', () => {
  // AC-4: Swagger UI is served at /api-docs
  it('AC-4: returns 200 HTML page for Swagger UI', async () => {
    const res = await request(app).get('/api-docs/');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
