const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://mongo:27017";
const client = new MongoClient(uri,);

async function seedDatabase() {
  try {
    await client.connect();
    const database = client.db("carInfo");
    const collection = database.collection("info");

    this.brand = brand;
    this.model = model;
    this.year = year;
    this.licenseplate = licenseplate;

    const data = [
      { brand: "HONDA", model: "CIVIC", year: 2002, licenseplate: "TH926F"},
      { brand: "BMW", model: "M4", year: 2012, licenseplate: "XJKK03"},
    ];

    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

seedDatabase().catch(console.dir);