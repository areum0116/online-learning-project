const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Lecture = require('../models/lecture');

router.get('/my', async(req, res) => {
    res.render('lectures/my');
})

module.exports = router;