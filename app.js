const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Lecture = require('./models/lecture');
const Board = require('./models/board');

mongoose.connect('mongodb://127.0.0.1:27017/online-learning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/boards', async (req, res) => {
    const boards = await Board.find({});
    res.render('boards/index', { boards });
});

app.get('/boards/new', (req, res) => {
    res.render('boards/new');
});

app.post('/boards', async (req, res) => {
    const board = new Board(req.body.board);
    await board.save();
    res.redirect(`/boards/${board._id}`);
});

app.get('/boards/:id', async (req, res) => {
    const board = await Board.findById(req.params.id);
    res.render('boards/show', { board });
});

app.get('/boards/:id/edit', async (req, res) => {
    const board = await Board.findById(req.params.id);
    res.render('boards/edit', { board });
});

app.put('/boards/:id', async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    res.redirect(`/boards/${board._id}`);
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});