const express = require('express');
const app = express();
const port = 8000;
app.get('/', (req, res) => res.send('<h1>This is my home page</h1>'));
app.get('/about', (req, res) => res.send('<h1>This is about page</h1>'));
app.get('/contact', (req, res) => res.send('<h1>This is a contact page</h1>'));
app.listen(port, () => console.log('Node server is running!'));
