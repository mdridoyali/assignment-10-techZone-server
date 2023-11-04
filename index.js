const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER_}:${process.env.DB_PASS_}@cluster0.w9fev91.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Send a ping to confirm a successful connection

    const productsCollection = client.db("productsDB").collection("products");
    const categoryCollection = client.db("productsDB").collection("categories");
    const cartCollection = client.db("productsDB").collection("cartProducts");

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    // my carts product
    app.get("/cartProducts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    // read data for brand wise
    app.get("/products/:brand_name", async (req, res) => {
      const { brand_name } = req.params;
      console.log(brand_name);
      const query = { brandName: brand_name };
      const result = await productsCollection.find(query).toArray();
      console.log("result", result);
      res.send(result);
    });

    // get data for details route
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      console.log("result", result);
      res.send(result);
    });

    
    // for update
    app.get("/updateProduct/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id : new ObjectId(id)}
      const result = await productsCollection.findOne(query)
      res.send(result);
    });

    
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProducts = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = {
        $set: {
          name: updatedProducts.name,
          image: updatedProducts.image,
          brandName: updatedProducts.brandName,
          type: updatedProducts.type,
          price: updatedProducts.price,
          rating: updatedProducts.rating,
          description: updatedProducts.description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });


    // add all product
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // add to cart product
    app.post("/cartProducts", async (req, res) => {
      const product = req.body;
      console.log("cartPro", product);

      const result = await cartCollection.insertOne(product);
      console.log("result", result);
      res.send(result);
    });

    // cart product delete
    app.delete("/cartProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud in running...");
});
app.listen(port, () => {
  console.log(`Crud is running on port: ${port}`);
});
