process.env.JWT_SECRET = 'test-secret';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongod;
let token;
const lead = { name: 'Asha Rao', email: 'asha@acme.com', phone: '+91 98765 43210', company: 'Acme', source: 'Website' };

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  const res = await request(app).post('/api/auth/signup').send({ name: 'Tester', email: 't@t.com', password: 'secret1' });
  token = res.body.token;
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

const api = (m, url) => request(app)[m](url).set('Authorization', `Bearer ${token}`);

test('rejects unauthenticated requests', async () => {
  expect((await request(app).get('/api/leads')).status).toBe(401);
});

test('rejects invalid lead input', async () => {
  const res = await api('post', '/api/leads').send({ ...lead, email: 'nope' });
  expect(res.status).toBe(400);
  expect(res.body.errors.email).toBeDefined();
});

test('create, list, filter, update, delete lifecycle', async () => {
  const created = await api('post', '/api/leads').send(lead);
  expect(created.status).toBe(201);
  expect(created.body.status).toBe('New');

  expect((await api('post', '/api/leads').send(lead)).status).toBe(409);

  const list = await api('get', '/api/leads?search=asha&status=New');
  expect(list.body.total).toBe(1);

  const updated = await api('put', `/api/leads/${created.body._id}`).send({ ...lead, status: 'Qualified' });
  expect(updated.body.status).toBe('Qualified');

  const stats = await api('get', '/api/leads/stats');
  expect(stats.body.Qualified).toBe(1);

  expect((await api('delete', `/api/leads/${created.body._id}`)).status).toBe(200);
  expect((await api('get', '/api/leads')).body.total).toBe(0);
});
