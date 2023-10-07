const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { boardSchema } = require('./schemas.js');

const ExpressError = require('../utils/ExpressError');
const Board = require('../models/board');

const validateBoard = (req, res, next) => {
    const { error } = boardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const boards = await Board.find({});
    res.render('boards/index', { boards });
}));

router.get('/new', (req, res) => {
    res.render('boards/new');
});

router.post('/', validateBoard, catchAsync(async (req, res, next) => {
    // if (!req.body.board) throw new ExpressError('Invalid Board Data', 400);
    const board = new Board(req.body.board);
    await board.save();
    req.flash('success', '새로운 글 작성');
    res.redirect(`/boards/${board._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const board = await Board.findById(req.params.id);
    if(!board) {
        req.flash('error', '해당 글은 삭제되었거나 존재하지 않습니다.');
        return res.redirect('/boards');
    }
    res.render('boards/show', { board });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const board = await Board.findById(req.params.id);
    if(!board) {
        req.flash('error', '해당 글은 삭제되었거나 존재하지 않습니다.');
        return res.redirect('/boards');
    }
    res.render('boards/edit', { board });
}));

router.put('/:id', validateBoard, catchAsync(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    req.flash('success', '수정 완료');
    res.redirect(`/boards/${board._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    req.flash('success', '삭제 완료');
    res.redirect('/boards');
}));

module.exports = router;