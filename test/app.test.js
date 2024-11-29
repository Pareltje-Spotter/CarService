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


const request = require('supertest');
const app = require('../index'); // Path to your Express app
const { MongoClient } = require('mongodb');

let connection;
let db;
let server;

beforeAll(async () => {
  // Start the server
  server = app.listen(3000);

  // Connect to MongoDB
  connection = await MongoClient.connect(`mongodb://mongoadmin:mongoadmin@${process.env.mongoInstance || "localhost"}:27017`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = connection.db('carInfo');
});

afterAll(async () => {
  // Close MongoDB connection
  await connection.close();
  await new Promise(resolve => server.close(resolve));

});

// Integration Test 
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

  test('GET /carinfo/license/:license should return a car by license plate', async () => {
    const response = await request(app).get('/carinfo/license/ABC123');
    expect(response.status).toBe(200);
    expect(response.body.model).toBe('Corolla');
  });

  test('POST /carinfo/create should create a new car', async () => {
    const newCar = { brand: 'Ford', model: 'Focus', year: 2018, licenseplate: 'DEF789' };
    const response = await request(app).post('/carinfo/create').send(newCar);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Document created successfully');
  });
});

// End-to-End Test Example
// DEBUG FIRST
// describe('E2E Tests for Car Info API', () => {
//   test('Full flow of creating, retrieving, updating, and deleting a car', async () => {
//     // Step 1: Create a new car
//     const carData = { brand: 'Tesla', model: 'Model S', year: 2022, licenseplate: 'EV123' };
//     const createResponse = await request(app).post('/carinfo/create').send(carData);
//     expect(createResponse.status).toBe(201);
//     const createdCarId = createResponse.body.data;

//     // Step 2: Retrieve the car
//     const getResponse = await request(app).get(`/carinfo/${createdCarId}`);
//     expect(getResponse.status).toBe(200);
//     expect(getResponse.body.model).toBe('Model S');

//     // Step 3: Update the car
//     const updatedData = { brand: 'Tesla', model: 'Model 3', year: 2023 };
//     const updateResponse = await request(app).put(`/carinfo/update/${createdCarId}`).send(updatedData);
//     expect(updateResponse.status).toBe(200);

//     // Step 4: Delete the car
//     const deleteResponse = await request(app).delete(`/carinfo/delete/${createdCarId}`);
//     expect(deleteResponse.status).toBe(200);
//     expect(deleteResponse.body.message).toBe('Document updated successfully');
//   });
// });


// Health Check Test Example

// test('MongoDB connection health check', async () => {
//   const db = await MongoClient.connect("mongodb://mongoadmin:mongoadmin@mongo:27017", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   expect(db.isConnected()).toBe(true);
//   db.close();
// });
