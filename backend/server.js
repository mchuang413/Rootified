const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const uri = "mongodb+srv://mchuangyc:p10U1cicI1VpoYTN@cluster0.basxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function createUser(email, password, level = 1) {
    try {
        await client.connect();
        const database = client.db("myDatabase");
        const users = database.collection("users");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            email: email,
            password: hashedPassword,
            level: level
        };

        const result = await users.insertOne(user);
        console.log(`New user created with the following id: ${result.insertedId}`);
        return result.insertedId;
    } finally {
        await client.close();
    }
}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/register', async (req, res) => {
    const { email, password, level } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const userId = await createUser(email, password, level);
        res.status(201).send(`User created with ID: ${userId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
