const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//async functions
//user : dbuser2 
// password : SFafj7DrVyjbGiHw

const uri = "mongodb+srv://dbuser2:SFafj7DrVyjbGiHw@cluster0.ksaovkw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollections = client.db('MongoDBCrud').collection('users');
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollections.findOne(query);
            res.send(user)

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollections.insertOne(user);
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };

            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                },
            };

            const result = await userCollections.updateOne(filter, updatedUser, options);
            res.send(result);
            
        })




        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete ', id);
            const query = { _id: ObjectId(id) };
            const result = await userCollections.deleteOne(query);
            console.log(result);
            res.send(result);
        })
    }

    finally {
    }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('Hello MongoDB cord server')
})


app.listen(port, () => {
    console.log(`This is a test listening on ${port}	`);
})