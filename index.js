const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = "mongodb+srv://carToys:oYTR0Khtak3AfPWu@cluster0.1w56ggc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

    const CategoryCollection = client.db('carToys').collection('carServices');
    const bookingCollection = client.db('carToys').collection('bookings');

    app.get('/carServices', async(req, res) => {
      const cursor = CategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/carServices/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        // sort matched documents in descending order by rating
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1,  url: 1},
      };
      const result = await CategoryCollection.findOne(query);
      res.send(result);
    })


    // // bookings

    app.get('/bookings', async (req, res) => {
      const cursor = bookingCollection.find();
      const result = await cursor.toArray();
      console.log(result)
      res.send(result)
    })

    app.post('/bookings', async (req,res) => {
      const booking = req.body;
      console.log(booking)
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Toy car is runnig')
})

app.listen(port, () => {
  console.log(`Car Toy Server is runnig on port ${port}`)
})