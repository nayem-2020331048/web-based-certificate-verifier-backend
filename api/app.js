const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 5500; 

const dbConfig = {
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'student', 
};

//app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
        res.sendFile(__dirname + "/../index.html"); 
       
});

app.post('/verify', async (req, res) => {
        const registrationNumber = req.body.registrationNumber;
        const dateOfBirth = req.body.dateOfBirth;

        try {
                const connection = await pool.getConnection();
                const [results] = await connection.execute(
                        'SELECT * FROM student WHERE registration_no = ? AND birthday = ?',
                        [registrationNumber, dateOfBirth]
                );
                connection.release();

                if (results.length > 0) {
                        //res.sendFile(__dirname + '/View.html');
                        res.send(results);
                } else {
                       // res.redirect('/'); 
                       res.send({error:'No matching data found'});
                }
        } catch (error) {
                console.error('Error processing the form:', error);
                res.status(500).json({ error: 'Internal Server Error' });
        }
});

app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
});
