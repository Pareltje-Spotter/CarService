const express = require('express')
const cors = require('cors')
const amqplib = require('amqplib')
const admin = require('firebase-admin');
var serviceAccount = require("./key.json");

const app = express();
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Messagig
const port = 5001;
var connection = null;
var channel = null;

async function sendMessage(licenseplate) {
    connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@localhost');
    channel = await connection.createChannel();

    const queue = 'carQueue';

    await channel.assertQueue(queue, {
        durable: false
    });

    const correlationId = "12342";

    console.log(' [x] Requesting more info:');

    return new Promise((resolve, reject) => {
        channel.consume(queue, function (msg) {
            if (msg.properties.correlationId === correlationId) {
                console.log(' [.] Got: %s', msg.content.toString());
                connection.close();
                resolve(msg.content.toString()); // Resolve promise with response
            }
        }, {
            noAck: true
        });
        // rpc_queue = queuename of receiver
        channel.sendToQueue('rpc_queue',
            Buffer.from(licenseplate), {
            correlationId: correlationId,
            replyTo: queue
        });
    });
}

async function messageConsumer() {
    connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@localhost')
    channel = await connection.createChannel()

    var queue = 'carQueue';

    channel.assertQueue(queue, {
        durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, async function reply(msg) {

        console.log(`received: ${msg.content.toString()}`);

        const carRef = db.collection('carInfo').doc(msg.content.toString());
        const carData = await carRef.get();

        // Check if document exists
        if (!carData.exists) {
            responseMessage = { error: 'Car not found' };
        } else {
            responseMessage = carData.data();
        }

        await channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(JSON.stringify(responseMessage)), {
            correlationId: msg.properties.correlationId
        });
        
        console.log(`Sent: ${JSON.stringify(responseMessage)}`);

        channel.ack(msg);
    });


}


// API
// /read/all
app.get('/carinfo', async (req, res) => {
    try {
        const carRef = db.collection('carInfo');
        const response = await carRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        })
        res.send(responseArr);
    }
    catch (error) {
        res.send(error);
    }
})

app.get('/carinfo/:id', async (req, res) => {
    try {
        // const responseMessage = await sendMessage(req.params.id);

        //gets something, using the received message
        const carRef = db.collection('carInfo').doc(req.params.id);
        const carData = await carRef.get();

        // You can now use responseMessage here
        const combinedResponse = {
            carData: carData.data(),
            dataFromOtherSource: responseMessage
        };
        res.send(combinedResponse);
    } catch (error) {
        res.send(error);
    }
})

app.post('/carinfo/create', async (req, res) => {
    try {
        const { brand, model, year, licenseplate } = req.body;
        const carJson = {
            brand, model, year, licenseplate
        };
        const docRef = await db.collection('carInfo').doc(licenseplate).set({
            brand: carJson.brand,
            model: carJson.model,
            year: carJson.year,
            license: carJson.licenseplate
        });

        res.status(201).json({ message: 'carInfo created successfully', id: docRef.id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/carinfo/update/:id', async (req, res) => {
    try {
        // Retrieve the ID from the request parameters
        const id = req.params.id;
        // Retrieve the updated data from the request body
        const updatedData = req.body;

        // Get a reference to the document to be updated
        const docRef = admin.firestore().collection('carInfo').doc(id);

        // Update the document
        await docRef.update(updatedData);

        res.status(200).json({ message: 'Document updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/carinfo/delete/:id', async (req, res) => {
    try {
        const docRef = db.collection('carInfo').doc(req.params.id);
        await docRef.delete();

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

const db = admin.firestore();
messageConsumer()

app.listen(port, async () => {
    console.log(`Server is running on PORT ${port}`);
    // console.log(" [x] Sending Ping")
    // await sendMessage('ping');
    // console.log('----')
});

