import { describe, it, expect, beforeAll, each } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

// A basic test to verify Jest is set up correctly
describe('Jest setup test', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });
});

// Tests to verify server is setup and exported correctly
describe('Server Basic Setup Works', () => {
  it('should export an express app', () => {
    expect(app).toBeDefined(); // Check app instance exists
    expect(typeof app).toBe('function'); // Express apps are functions
  });
});

// Tests for endpoints in server.js
describe('Empty and Invalid Server Endpoints Work', () => {
  it('should return 200 for GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
  it('should 404 for invalid routes', async () => {
    const res = await request(app).get('/some-random-route');
    expect(res.statusCode).toBe(404);
  });
});

// Tests for health endpoint. Only basic tests, database connection tests will be in databaseHealth.test.js
describe('Health Check Endpoint Works', () => {
  let res;
  beforeAll(async () => {
    res = await request(app).get('/health');
  });

  it('should return 200 for GET /health', async () => {
    expect(res.statusCode).toBe(200);
  });

  const properties = ['readyState', 'dbName', 'dbModels', 'dbHost', 'dbPort', 'dbUser'];
  each(properties)(`should have %s in response body`, (prop) => {
    expect(res.body).toHaveProperty(prop);
  });

  it('should return a number for readyState', () => {
    expect(typeof res.body.readyState).toBe('number');
  });
});
