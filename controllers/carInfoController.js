const carInfoService = require('../services/carInfoService');
const axios = require('axios');

exports.getCars = async (req, res) => {
    try {
        const cars = await carInfoService.getAllCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cars' });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const id = req.params.id;

        const car = await carInfoService.getCarById(id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve car' });
    }
};

exports.getCarByLicensePlate = async (req, res) => {
    try {
        const id = req.params.license;

        const car = await carInfoService.getCarByLicense(id);
        if (car) {
            return res.status(200).json(car); // Response sent here
        }
        const response2 = await axios.get(`https://cloud-function.azurewebsites.net/api/rdw-call?car=TH926F`);
        try {
            const response = await axios.get(`https://cloud-function.azurewebsites.net/api/rdw-call?car=${id}`);
            if (response.data != null) {
                const newCar = await carInfoService.getCarByLicense(id);
                return res.status(200).json(newCar); // Response sent here
            }
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
        }

        // Send a 404 response only if no car is found and no response is received
        return res.status(404).json({ error: 'Car not found' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve car' }); // Final fallback response
    }
};

// For message bus, but we can save by id now I think
exports.getCarByIdForMarker = async (carId) => {
    try {
        // used to be the same, but changes with mongo
        // const car = await carInfoService.getCarById(id);
        const car = await carInfoService.getCarById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        return car;
    } catch (error) {
        return;
    }
};

exports.createCar = async (req, res) => {
    try {
        const { brand, model, year, license } = req.body;
        const newCar = await carInfoService.createCar(req.body);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create car' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const id = req.params.id;
        const { brand, model, year, license } = req.body;
        const updatedCar = await carInfoService.updateCar(id, req.body);
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update car' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCar = await carInfoService.deleteCar(id);
        res.status(200).json(deletedCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
};