
const express = require('express');
const { Pool } = require('pg');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: 'postgresql://LatinRootsModule_owner:Y5OFJKV3xjnr@ep-soft-limit-a5i6em4x.us-east-2.aws.neon.tech/LatinRootsModule?sslmode=require'
});

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

app.get('/quiz', async (req, res) => {
    try {
        const result = await pool.query(`
            WITH random_question AS (
                SELECT root AS question, definition AS correct_answer
                FROM latin_roots
                OFFSET floor(random() * (SELECT COUNT(*) FROM latin_roots)) LIMIT 1
            ),
            wrong_answers AS (
                SELECT definition AS wrong_answer
                FROM latin_roots
                WHERE definition NOT IN (SELECT correct_answer FROM random_question)
                ORDER BY random()
                LIMIT 3
            )
            SELECT question, correct_answer, array_agg(wrong_answer) AS wrong_answers
            FROM random_question, wrong_answers
            GROUP BY question, correct_answer
        `);
        if (result.rows.length === 0) {
            throw new Error('No quiz question found');
        }
        const quiz = result.rows[0];
        res.json({
            question: quiz.question,
            correct_answer: quiz.correct_answer,
            answers: [quiz.correct_answer, ...quiz.wrong_answers]
        });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send(`Error retrieving data: ${err.message}`);
    }
});


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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
