const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Lecture = require('../models/lecture');

router.get('/', async (req, res) => {
    const lectures = await Lecture.find({});
    res.render('lectures/index', { lectures });
})


module.exports = router;