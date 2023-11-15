const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Lecture = require('../models/lecture');
let num = 1;

router.get('/', async (req, res) => {
    num = 1;
    const lectures = await Lecture.find({});
    res.render('lectures/index', { lectures, num });
})

router.get('/index_sort_by_view_cnt', async (req, res) => {
    num = 2;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].view_cnt]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
})

router.get('/index_sort_by_date', async (req, res) => {
    num = 3;
    const lectures = await Lecture.find({});

    res.render('lectures/index', { lectures, num });
})

router.get('/index_sort_by_subscribers', async (req, res) => {
    num = 4;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].subscribers]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
})

router.get('/index_sort_by_vid_cnt', async (req, res) => {
    num = 5;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].total_vid]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
})

module.exports = router;