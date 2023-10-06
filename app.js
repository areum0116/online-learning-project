const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { boardSchema } = require('./schemas.js');
const Lecture = require('./models/lecture');
const Board = require('./models/board');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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

const validateBoard = (req, res, next) => {
    const { error } = boardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/boards', catchAsync(async (req, res) => {
    const boards = await Board.find({});
    res.render('boards/index', { boards });
}));

app.get('/boards/new', (req, res) => {
    res.render('boards/new');
});

app.post('/boards', catchAsync(async (req, res, next) => {
    if (!req.body.board) throw new ExpressError('Invalid Board Data', 400);
    const board = new Board(req.body.board);
    await board.save();
    res.redirect(`/boards/${board._id}`);
}));

app.get('/boards/:id', catchAsync(async (req, res) => {
    const board = await Board.findById(req.params.id);
    res.render('boards/show', { board });
}));

app.get('/boards/:id/edit', catchAsync(async (req, res) => {
    const board = await Board.findById(req.params.id);
    res.render('boards/edit', { board });
}));

app.put('/boards/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    res.redirect(`/boards/${board._id}`);
}));

app.delete('/boards/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    res.redirect('/boards');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});