const express = require('express');
const router = express.Router();
const boards = require('../controllers/boards');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBoard } = require('../middleware');

const Board = require('../models/board');

router.route('/')
    .get(catchAsync(boards.index))
    .post(isLoggedIn, validateBoard, catchAsync(boards.createBoard));

router.get('/new', isLoggedIn, boards.renderNewForm);

router.route('/:id')
    .get(catchAsync(boards.showBoard))
    .put(isLoggedIn, isAuthor, validateBoard, catchAsync(boards.updateBoard))
    .delete(isLoggedIn, isAuthor, catchAsync(boards.deleteBoard));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(boards.renderEditForm));

module.exports = router;