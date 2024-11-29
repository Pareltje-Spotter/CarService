// const request = require('supertest');
// const app = require('../index'); // Your Express app

// describe('Get car by ID (license plate)', () => {
//   it('should return carinfo', async () => {
//     const response = await request(app)
//     .get('/carinfo/TH926F')
//       // .post('/users')
//       // .send({ name: 'John Doe', email: 'johndoe@example.com' });

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('model');
//     // expect(response.body.name).toBe('John Doe');
//   });

//   // ... other tests for different endpoints and scenarios
// });

// Integration Test Example

const request = require('supertest');
const app = require('../index'); // Path to your Express app
const { MongoClient } = require('mongodb');

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect("mongodb://mongoadmin:mongoadmin@localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = connection.db('carInfo');
});

afterAll(async () => {
  await connection.close();
});

describe('Car Info API Integration Tests', () => {
  beforeEach(async () => {
    // Set up initial test data
    const collection = db.collection('info');
    await collection.insertMany([
      { brand: 'Toyota', model: 'Corolla', year: 2020, licenseplate: 'ABC123' },
      { brand: 'Honda', model: 'Civic', year: 2019, licenseplate: 'XYZ456' },
    ]);
  });

  afterEach(async () => {
    // Clean up the database
    const collection = db.collection('info');
    await collection.deleteMany({});
  });

  test('GET /carinfo should return all cars', async () => {
    const response = await request(app).get('/carinfo');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); // Based on seeded data
  });

  // test('GET /carinfo/license/:license should return a car by license plate', async () => {
  //   const response = await request(app).get('/carinfo/license/ABC123');
  //   expect(response.status).toBe(200);
  //   expect(response.body.model).toBe('Corolla');
  // });

  // test('POST /carinfo/create should create a new car', async () => {
  //   const newCar = { brand: 'Ford', model: 'Focus', year: 2018, licenseplate: 'DEF789' };
  //   const response = await request(app).post('/carinfo/create').send(newCar);
  //   expect(response.status).toBe(201);
  //   expect(response.body.message).toBe('Document created successfully');
  // });
});
