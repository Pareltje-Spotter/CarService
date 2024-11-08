const CarInfo = require('../models/carInfo');  // If using models
const db = require('../config/db.config');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

// Place in db config
const uri = "mongodb://mongoadmin:mongoadmin@mongo:27018";
const client = new MongoClient(uri,);

async function connectToMongoDB() {
  //export
  try {
    await client.connect();
    // console.log('Connected to MongoDB successfully!');
    return client.db('carInfo');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

exports.getAllCars = async () => {
  const db = await connectToMongoDB();
  const collection = db.collection('info');
  const response = await collection.find().toArray();
  return response;
};

exports.getCarById = async (id) => {
  const db = await connectToMongoDB();
  const collection = db.collection('info');
  const response = await collection.findOne({ _id: new ObjectID(id) });
  return response;
};

// For message bus, but we can save by id now I think
exports.getCarByLicense = async (id) => {
  const db = await connectToMongoDB();
  const collection = db.collection('info');
  const response = await collection.findOne({ license: id });
  return response;
};

exports.createCar = async (carInfo) => {
  const db = await connectToMongoDB();
  const collection = db.collection('info')
  const result = await collection.insertOne(carInfo);
  return { message: 'Document created successfully', data: result.insertedId };
};

exports.updateCar = async (id, updatedData) => {
  const db = await connectToMongoDB();
  const collection = db.collection('info')
  const result = await collection.updateOne({ _id: new ObjectID(id) }, { $set: updatedData });
  return { message: 'Document updated successfully' };
};

exports.deleteCar = async (id) => {
  const db = await connectToMongoDB();
  const collection = db.collection('info')
  const result = await collection.deleteOne({ _id: new ObjectID(id) });
  return { message: 'Document updated successfully' };
};