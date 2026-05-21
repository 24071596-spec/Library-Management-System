const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // change if your password is different
    database: 'library_db'
});

db.connect(err => {
    if (err) {
        console.log("Database Error:", err);
    } else {
        console.log("Connected to MySQL ✅");
    }
});


// 🔹 GET all books
app.get('/books', (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return res.json(err);
        res.json(result);
    });
});


// 🔹 ADD new book
app.post('/books', (req, res) => {
    const { name } = req.body;

    db.query(
        "INSERT INTO books (name, status) VALUES (?, 'available')",
        [name],
        (err, result) => {
            if (err) return res.json(err);
            res.json({ message: "Book added" });
        }
    );
});


// 🔹 ISSUE book
app.put('/issue/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        "UPDATE books SET status='issued' WHERE id=?",
        [id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Book issued" });
        }
    );
});


// 🔹 RETURN book
app.put('/return/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        "UPDATE books SET status='available' WHERE id=?",
        [id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Book returned" });
        }
    );
});


// 🔹 Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000 🚀");
});