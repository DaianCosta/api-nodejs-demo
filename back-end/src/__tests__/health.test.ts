import request from 'supertest';
import app from '../app';

describe('GET /api/health', () => {
  // AC-5: health check endpoint returns 200
  it('AC-5: returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
