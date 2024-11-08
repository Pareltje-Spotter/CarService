const carInfoService = require('../services/carInfoService');

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

// For message bus, but we can save by id now I think
exports.getCarByLicense = async (license) => {
    try {
        // used to be the same, but changes with mongo
        // const car = await carInfoService.getCarById(id);
        const car = await carInfoService.getCarById(license);
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