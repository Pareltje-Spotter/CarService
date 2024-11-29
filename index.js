const express = require('express');
const carInfoController = require('./controllers/carInfoController');
const cors = require('cors')
const amqplib = require('amqplib')

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const router = express.Router();
app.use('/carinfo', router);
router.get('/', carInfoController.getCars);
router.get('/:id', carInfoController.getCarById);
router.get('/license/:license', carInfoController.getCarByLicensePlate);
router.post('/create', carInfoController.createCar);
router.put('/update/:id', carInfoController.updateCar);
router.delete('/delete/:id', carInfoController.deleteCar);

// ... error handling middleware
const port = 5001;

async function messageConsumer() {
    // connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@localhost')
    connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq')
    channel = await connection.createChannel()

    var queue = 'carQueue';

    channel.assertQueue(queue, {
        durable: false
    });
    
    channel.prefetch(1);
    // console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, async function reply(msg) {

        console.log(`received: ${msg.content.toString()}`);

        const carData = await carInfoController.getCarByIdForMarker(msg.content.toString());
        console.log(carData)

        // Check if document exists
        if (!carData) {
            responseMessage = { error: 'Car not found' };
        } else {
            responseMessage = carData;
        }

        await channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(JSON.stringify(responseMessage)), {
            correlationId: msg.properties.correlationId
        });

        console.log(`Sent: ${JSON.stringify(responseMessage)}`);

        channel.ack(msg);
    });
}
messageConsumer();

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

module.exports = app;