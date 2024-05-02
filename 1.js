const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = 'books.json';

app.use(express.json());
const readBooksFromFile = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return [];
    }
};
const writeBooksToFile = (books) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
    } catch (error) {
        console.error('Error writing data file:', error);
    }
};
app.get('/books', (req, res) => {
    const books = readBooksFromFile();
    res.json(books);
});
app.get('/books/:id', (req, res) => {
    const books = readBooksFromFile();
    const book = books.find(book => book.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});
app.post('/books', (req, res) => {
    const { title, author, year } = req.body;
    const newBook = { id: uuidv4(), title, author, year };
    const books = readBooksFromFile();
    books.push(newBook);
    writeBooksToFile(books);
    res.status(201).json(newBook);
});
app.put('/books/:id', (req, res) => {
    const { title, author, year } = req.body;
    const books = readBooksFromFile();
    const index = books.findIndex(book => book.id === req.params.id);
    if (index !== -1) {
        books[index] = { ...books[index], title, author, year };
        writeBooksToFile(books);
        res.json(books[index]);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});
app.delete('/books/:id', (req, res) => {
    const books = readBooksFromFile();
    const filteredBooks = books.filter(book => book.id !== req.params.id);
    if (books.length !== filteredBooks.length) {
        writeBooksToFile(filteredBooks);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
