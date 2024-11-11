const request = require('supertest');
const app = require('../index'); // Your Express app

describe('Get car by ID (license plate)', () => {
  it('should return carinfo', async () => {
    const response = await request(app)
    // .get('/carinfo/TH926F')
    .get('/carinfo')

      // .post('/users')
      // .send({ name: 'John Doe', email: 'johndoe@example.com' });

    expect(response.statusCode).toBe(200);
    // expect(response.body).toHaveProperty('model');
    // expect(response.body.name).toBe('John Doe');
  });

  // ... other tests for different endpoints and scenarios
});