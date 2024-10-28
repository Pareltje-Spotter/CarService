// services/carInfoService.js
const CarInfo = require('../models/carInfo');  // If using models
const db = require('../config/db.config');

exports.getAllCars = async () => {
  const response = await db.collection('carInfo').get();
  let responseArr = [];
 
  response.forEach(doc => {
    console.log(doc.data())
    responseArr.push(doc.data());
  });
  return responseArr;
};

exports.getCarById = async (id) => {
  const carRef = db.collection('carInfo').doc(id);
  const carData = await carRef.get();
  return carData.data();
};

exports.getCarByLicense = async (id) => {
    const carRef = db.collection('carInfo').doc(id);
    const carData = await carRef.get();
    return carData.data();
  };

exports.createCar = async (carInfo) => {
  const docRef = await db.collection('carInfo').doc(carInfo.licenseplate).set(carInfo);
  return { message: 'carInfo created successfully', id: docRef.id };
};

exports.updateCar = async (id, updatedData) => {
  const docRef = db.collection('carInfo').doc(id);
  await docRef.update(updatedData);
  return { message: 'Document updated successfully' };
};

exports.deleteCar = async (id) => {
  const docRef = db.collection('carInfo').doc(id);
  await docRef.delete();
  return { message: 'Document deleted successfully' };
};